import { Component, EventEmitter, Output, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HouseCardComponent } from '../../../features/components/house-card/house-card.component';
import { SearchService } from '../../services/search-service/search-service.service';

@Component({
  selector: 'app-ai-search-popup',
  standalone: true,
  imports: [CommonModule, FormsModule, HouseCardComponent],
  templateUrl: './ai-search-popup.component.html',
  styleUrls: ['./ai-search-popup.component.css']
})
export class AISearchPopupComponent implements OnInit, OnDestroy {
  @Output() closed = new EventEmitter<string | null>();
  @Output() resultsReturned = new EventEmitter<any[]>();

  searchPrompt = '';
  isLoading = false;
  errorMessage = '';
  searchResults: any[] = [];
  isListening = false;
  private recognition: any;

  constructor(
    private searchService: SearchService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.initializeSpeechRecognition();
  }

  ngOnDestroy(): void {
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
      this.searchPrompt = transcript; // Update the searchPrompt with the spoken text
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

  performSearch(): void {
    this.searchPrompt = this.searchPrompt.trim();

    if (!this.searchPrompt) {
      this.errorMessage = 'Please describe what you\'re looking for';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.searchResults = [];

    this.searchService.smartSearchNaturalLanguage(this.searchPrompt).subscribe({
      next: (results) => {
        this.searchResults = results || [];
        this.isLoading = false;
        this.resultsReturned.emit(this.searchResults);

        if (this.searchResults.length === 0) {
          this.errorMessage = 'No results found for your search.';
        }
      },
      error: (err) => {
        this.errorMessage = 'Error performing AI search. Please try again.';
        this.isLoading = false;
        console.error('AI search error:', err);
      }
    });
  }

  trackByHouseId(index: number, house: any): number {
    return house.houseId;
  }

  closeWithResults(): void {
    this.closed.emit(this.searchPrompt);
  }

  closeModal(): void {
    this.closed.emit(null);
  }
}
