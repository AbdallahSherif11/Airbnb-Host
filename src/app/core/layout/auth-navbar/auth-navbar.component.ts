import { Component, inject, OnInit, HostListener, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AccountService } from '../../services/account/account.service';
import { MessageService } from '../../../features/services/message-services/message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <nav class="bg-white border-gray-200 shadow-sm">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <!-- Logo -->
        <a routerLink="/home" class="flex items-center space-x-3 rtl:space-x-reverse flex-shrink-0 cursor-pointer">
          <div class="flex align-items-center gap-2 items-center text-3xl text-main hover:text-mainHover transition duration-200">
            <!-- <i class="fa-brands fa-airbnb"></i> -->
            <!-- <p class="font-bold tracking-tight hidden md:block">Stayin'</p> -->
            <img class="h-10 pr-2" src="assets/images/logo/logo9.png" alt=""/>
            <img class="h-9 pt-1 hidden md:block" src="assets/images/logo/logo8.png" alt=""/>
          </div>
        </a>

        <!-- User Dropdown -->
        <div class="flex items-center flex-shrink-0 dropdown-container relative">
          <button
            type="button"
            class="flex items-center gap-2 text-sm bg-gray-100 rounded-full p-1 pr-3 hover:bg-gray-200 shadow-lg transition-all duration-200"
            (click)="toggleDropdown()"
          >
            <img
              *ngIf="userProfilePicture"
              [src]="userProfilePicture"
              class="w-8 h-8 rounded-full object-cover"
              alt="Profile picture"
              onerror="this.src='assets/default-profile.png'"
            >
            <i class="fa-solid fa-bars text-main text-sm"></i>
          </button>

          <!-- Dropdown menu -->
          <div
            *ngIf="showDropdown"
            class="z-50 absolute right-0 top-full mt-1 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <div class="px-4 py-3 border-b border-gray-100">
              <span class="block text-sm font-medium text-gray-900 truncate">
                <i class="fa-solid fa-user"></i> {{ currentUserName || currentUserEmail }}
              </span>
              <span class="block text-xs text-gray-500 truncate" *ngIf="currentUserEmail && currentUserName">
                {{ currentUserEmail }}
              </span>
            </div>
            <ul class="py-1">
              <li><a routerLink="/myhouses" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"><i class="fa-solid fa-house-chimney-window"></i>&nbsp;&nbsp;My Houses</a></li>
              <li class="border-t border-gray-100 py-1"></li>
              <li><a routerLink="/wishlist" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"><i class="fa-solid fa-heart"></i>&nbsp;&nbsp;My Wishlist</a></li>
              <li class="border-t border-gray-100 py-1"></li>
              <li><a routerLink="/wallet" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"><i class="fa-solid fa-wallet"></i>&nbsp;&nbsp;Wallet</a></li>
              <li class="border-t border-gray-100 py-1"></li>
              <li><a routerLink="/my-trips" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"><i class="fa-solid fa-map-location"></i>&nbsp;&nbsp;My Trips</a></li>
              <li class="border-t border-gray-100 py-1"></li>
              <li><a routerLink="/chat" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"><i class="fa-solid fa-message"></i>&nbsp;&nbsp;Messages</a></li>
              <li class="border-t border-gray-100 py-1"></li>
              <li><a routerLink="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"><i class="fa-solid fa-gear"></i>&nbsp;&nbsp;My Profile</a></li>
              <li class="border-t border-gray-100 py-1"></li>
              <li><a routerLink="/addhouse" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"><i class="fa-solid fa-circle-plus"></i>&nbsp;&nbsp;Add your house</a></li>
              <li class="border-t border-gray-100 py-1"></li>
              <li><a (click)="signOut()" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"><i class="fa-solid fa-arrow-right-from-bracket"></i>&nbsp;&nbsp;Sign out</a></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .dropdown-container {
      position: relative;
    }
    
    /* Ensure the dropdown has proper z-index */
    [class*="z-50"] {
      z-index: 50;
    }
    
    /* Animation for smoother dropdown */
    [class*="origin-top-right"] {
      transform-origin: top right;
      transition: all 0.2s ease;
    }
  `]
})
export class AuthNavbarComponent implements OnInit, OnDestroy {
  private accountService = inject(AccountService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  showDropdown = false;
  userProfilePicture: string | null = null;
  currentUserName: string | null = null;
  private subscriptions = new Subscription();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  get currentUserEmail(): string | null {
    return this.accountService.currentUserEmail();
  }

  ngOnInit(): void {
    this.fetchUserProfile();
  }

  private fetchUserProfile(): void {
    const token = this.accountService.getToken();
    if (token) {
      const userId = this.decodeToken(token).sub;
      this.subscriptions.add(
        this.messageService.getUserById(userId).subscribe({
          next: (user) => {
            this.userProfilePicture = user.profilePictureUrl || 'assets/default-profile.png';
            this.currentUserName = `${user.firstName} ${user.lastName}`;
          },
          error: (err) => {
            console.error('Failed to fetch user profile:', err);
            this.userProfilePicture = 'assets/default-profile.png';
          }
        })
      );
    }
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  @HostListener('document:click', ['$event'])
  closeDropdownOnOutsideClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      this.showDropdown = false;
    }
  }

  signOut(): void {
    this.accountService.signOut();
    this.showDropdown = false;
    this.userProfilePicture = null;
    this.currentUserName = null;
    this.router.navigate(['/home']);
  }

  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error('Failed to decode token:', e);
      return null;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}