import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-house-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './house-card.component.html',
  styleUrls: ['./house-card.component.css']
})
export class HouseCardComponent {
  private router = inject(Router);

  // Input Properties
  @Input() houseId: number = 0;
  @Input() images: string[] = [];
  @Input() title: string = '';
  @Input() pricePerNight: number = 0;
  @Input() rating: number = 0;
  @Input() city: string = 'Unknown City';
  @Input() country: string = 'Unknown Country';
  @Input() numberOfRooms: number = 0;
  @Input() numberOfBeds: number = 0;
  @Input() hostName: string = 'Host';
  @Input() amenities: string[] = [];
  @Input() dateRange: string = '';
  @Input() hostType: string = '';
  @Input() latitude: number = 0;
  @Input() longitude: number = 0;
  @Input() isGuestFavorite: boolean = false;




  // Component State
  currentSlide = 0;
  isInWishlist = false;
  imageLoaded = false;
  defaultImage = 'https://via.placeholder.com/300x200?text=No+Image';

  // Image Events
  onImageLoad(): void {
    this.imageLoaded = true;
  }

  handleImageError(event: any): void {
    event.target.src = this.defaultImage;
    this.imageLoaded = true;
  }

  // Carousel Navigation
  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.images.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.images.length) % this.images.length;
  }

  toggleWishlist(): void {
    this.isInWishlist = !this.isInWishlist;
  }

  // Navigation
  navigateToDetails(): void {
    this.router.navigate(['/houses', this.houseId]);
  }

  // Helpers
  getFirstThreeAmenities(): string[] {
    return this.amenities.slice(0, 3);
  }
}

