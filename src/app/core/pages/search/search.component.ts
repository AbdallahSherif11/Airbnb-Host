import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HouseService } from '../../../features/services/house-services/house.service';
import { HouseCardComponent } from '../../../features/components/house-card/house-card.component';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../../layout/footer/footer.component";
import { NavbarComponent } from "../../layout/navbar/navbar.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, HouseCardComponent, FooterComponent, NavbarComponent, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchResults: any[] = [];
  isLoading = false;
  searchQuery = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private houseService: HouseService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      if (this.searchQuery) {
        this.performSearch(this.searchQuery);
      }
    });
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
      },
      error: (err) => {
        this.errorMessage = 'Error searching houses. Please try again.';
        this.isLoading = false;
        console.error('Search error:', err);
      }
    });
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], {
        queryParams: { q: this.searchQuery }
      });
    }
  }
  trackByHouseId(index: number, house: any): number {
    return house.houseId;
  }
}
