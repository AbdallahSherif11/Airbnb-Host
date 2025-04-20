import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HouseService } from '../../../features/services/house-services/house.service';
import { HouseCardComponent } from '../../../features/components/house-card/house-card.component';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../../layout/footer/footer.component";
import { NavbarComponent } from "../../layout/navbar/navbar.component";
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, HouseCardComponent, FooterComponent, NavbarComponent, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  searchResults: any[] = [];
  suggestions: any[] = [];
  isLoading = false;
  searchQuery = '';
  errorMessage = '';
  private searchSubject = new Subject<string>();
  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private houseService: HouseService
  ) {}

  ngOnInit(): void {
    // Handle query params for search
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      if (this.searchQuery) {
        this.performSearch(this.searchQuery);
      }
    });

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
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onInputChange(query: string): void {
    this.searchQuery = query;
    if (query.trim()) {
      this.searchSubject.next(query); // Emit the query for suggestions
    } else {
      this.suggestions = [];
    }
  }

  performSearch(query: string): void {
    if (!query.trim()) {
      this.errorMessage = 'Please enter a search term';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.searchResults = [];

    this.houseService.searchHouses(query).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.isLoading = false;
        this.suggestions = []; // Clear suggestions after search
      },
      error: (err) => {
        this.errorMessage = 'Error searching houses. Please try again.';
        this.isLoading = false;
        console.error('Search error:', err);
      }
    });
  }

  onSuggestionClick(suggestion: any): void {
    this.searchQuery = suggestion.title; // Set the clicked suggestion as the query
    this.performSearch(this.searchQuery); // Perform the search
  }

  trackByHouseId(index: number, house: any): number {
    return house.houseId;
  }
}
