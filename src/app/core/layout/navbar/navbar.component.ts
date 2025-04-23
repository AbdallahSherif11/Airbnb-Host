import { Component, inject, OnInit, HostListener, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HouseService } from '../../../features/services/house-services/house.service';
import { AccountService } from '../../services/account/account.service';
import { MessageService } from '../../../features/services/message-services/message.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import {AISearchPopupComponent } from '../../pages/ai-search-popup/ai-search-popup.component';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, AISearchPopupComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  private accountService = inject(AccountService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private houseService = inject(HouseService);


  showAISearch = false;
  searchKeyword = '';
  showMobileSearch = false;
  showDropdown = false;
  userProfilePicture: string | null = null;
  currentUserName: string | null = null;
  isListening = false;
  private recognition: any;
  suggestions: any[] = [];
  private searchSubject = new Subject<string>();
  private subscriptions = new Subscription();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  get isLoggedIn(): boolean {
    return this.accountService.isLoggedIn();
  }

  get currentUserEmail(): string | null {
    return this.accountService.currentUserEmail();
  }

  ngOnInit(): void {
    this.initializeSpeechRecognition();

    // Handle search suggestions
    this.subscriptions.add(
      this.searchSubject.pipe(
        debounceTime(300), // Wait for 300ms after typing stops
        distinctUntilChanged(), // Ignore if the query hasn't changed
        switchMap(query => this.houseService.searchHouses(query)) // Fetch suggestions
      ).subscribe({
        next: (results) => {
          this.suggestions = results.slice(0, 5); // Limit to 5 suggestions
        },
        error: (err) => {
          console.error('Error fetching suggestions:', err);
          this.suggestions = [];
        }
      })
    );

    if (this.isLoggedIn) {
      this.fetchUserProfile();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  private initializeSpeechRecognition(): void {
    // Only run in browser environment
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Check for browser support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    // @ts-ignore - TypeScript doesn't know about webkitSpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();

    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      this.searchKeyword = transcript; // Update the search bar with the spoken text
      this.isListening = false; // Stop listening
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      this.isListening = false;
    };

    this.recognition.onend = () => {
      if (this.isListening) {
        this.isListening = false;
      }
    };
  }

  toggleSpeechRecognition(): void {
    if (!this.recognition) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    } else {
      this.recognition.start();
      this.isListening = true;
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

  onInputChange(query: string): void {
    this.searchKeyword = query;
    if (query.trim()) {
      this.searchSubject.next(query); // Emit the query for suggestions
    } else {
      this.suggestions = [];
    }
  }

  onSuggestionClick(suggestion: any): void {
    this.searchKeyword = suggestion.title; // Set the clicked suggestion as the query
    this.search(); // Perform the search
  }

  search(): void {
    if (this.searchKeyword.trim()) {
      this.router.navigate(['search'], {
        queryParams: { q: this.searchKeyword },
        queryParamsHandling: 'merge'
      });
      this.searchKeyword = '';
      this.showMobileSearch = false;
      this.suggestions = [];
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




  onAISearchClose(searchQuery: string | null): void {
    this.showAISearch = false;
    if (searchQuery) {
      this.router.navigate(['search'], {
        queryParams: { q: searchQuery },
        queryParamsHandling: 'merge'
      });
    }
  }
  



}
