import { Component, inject, OnInit, HostListener } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HouseService } from '../../../features/services/house-services/house.service';
import { AccountService } from '../../services/account/account.service';
import { MessageService } from '../../../features/services/message-services/message.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  private accountService = inject(AccountService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private houseService = inject(HouseService);

  searchKeyword = '';
  showMobileSearch = false;
  showDropdown = false;
  userProfilePicture: string | null = null;
  currentUserName: string | null = null;

  get isLoggedIn(): boolean {
    return this.accountService.isLoggedIn();
  }

  get currentUserEmail(): string | null {
    return this.accountService.currentUserEmail();
  }

  ngOnInit(): void {
    if (this.isLoggedIn) {
      this.fetchUserProfile();
    }
  }

  private fetchUserProfile(): void {
    const token = this.accountService.getToken();
    if (token) {
      const userId = this.decodeToken(token).sub;
      this.messageService.getUserById(userId).subscribe({
        next: (user) => {
          this.userProfilePicture = user.profilePictureUrl || 'assets/default-profile.png';
          this.currentUserName = `${user.firstName} ${user.lastName}`;
        },
        error: (err) => {
          console.error('Failed to fetch user profile:', err);
          this.userProfilePicture = 'assets/default-profile.png';
        }
      });
    }
  }

  toggleMobileSearch(): void {
    this.showMobileSearch = !this.showMobileSearch;
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

  search(): void {
    if (this.searchKeyword.trim()) {
      this.router.navigate(['search'], {
        queryParams: { q: this.searchKeyword },
        queryParamsHandling: 'merge'
      });
      this.searchKeyword = '';
      this.showMobileSearch = false;
    }
  }

  signOut(): void {
    this.accountService.signOut();
    this.showDropdown = false;
    this.userProfilePicture = null;
    this.currentUserName = null;
  }

  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error('Failed to decode token:', e);
      return null;
    }
  }
}