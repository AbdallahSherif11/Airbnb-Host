import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HouseCardComponent } from '../house-card/house-card.component';
import { HouseService } from '../../services/house-services/house.service';

@Component({
  selector: 'app-house-list',
  standalone: true,
  imports: [CommonModule, HouseCardComponent],
  templateUrl: './house-list.component.html',
  styleUrls: ['./house-list.component.css']
})
export class HouseListComponent implements OnInit {
  houses: any[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private houseService: HouseService) {}

  ngOnInit(): void {
    this.loadHouses();
  }

  loadHouses(): void {
    this.houseService.getAllHouses().subscribe({
      next: (houses) => {
        this.houses = houses;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load houses. Please try again later.';
        this.isLoading = false;
        console.error('Error loading houses:', err);
      }
    });
  }
  
  calculateRating(reviews: any[] | undefined): number {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return parseFloat((sum / reviews.length).toFixed(1));
  }
}