import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnChanges {
  @Input() reviews: any[] = [];
  
  averageRating: number = 0;
  totalReviews: number = 0;
  showAllReviews: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reviews']) {
      this.calculateAverageRating();
    }
  }

  calculateAverageRating(): void {
    if (this.reviews && this.reviews.length > 0) {
      const sum = this.reviews.reduce((total, review) => total + (review.rating || 0), 0);
      this.averageRating = sum / this.reviews.length;
      this.totalReviews = this.reviews.length;
    } else {
      this.averageRating = 0;
      this.totalReviews = 0;
    }
  }

  getRoundedRating(): number {
    return Math.round(this.averageRating);
  }


  
}