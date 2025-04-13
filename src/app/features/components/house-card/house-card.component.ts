// house-card.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-house-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './house-card.component.html',
  styleUrls: ['./house-card.component.css']
})
export class HouseCardComponent {
  @Input() images: string[] = [];
  @Input() title: string = '';
  @Input() hostType: string = '';
  @Input() dateRange: string = '';
  @Input() price: number = 0;
  @Input() rating: number = 0;
  @Input() isGuestFavorite: boolean = false;

  currentSlide = 0;
  isInWishlist = false;
  imageLoaded = false;
  onImageLoad() {
    this.imageLoaded = true;
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.images.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.images.length) % this.images.length;
  }

  toggleWishlist(): void {
    this.isInWishlist = !this.isInWishlist;
  }
}