import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WishlistService } from '../../services/wishlist-service/wishlist.service';
import { AccountService } from '../../../core/services/account/account.service';

@Component({
  selector: 'app-house-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './house-card.component.html',
  styleUrls: ['./house-card.component.css']
})
export class HouseCardComponent implements OnInit {
  private router = inject(Router);
  private wishlistService = inject(WishlistService);
  private accountService = inject(AccountService);

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

  currentSlide = 0;
  isInWishlist = false;
  imageLoaded = false;
  defaultImage = 'https://via.placeholder.com/300x200?text=No+Image';

  ngOnInit(): void {
    this.wishlistService.wishlist$.subscribe(ids => {
      this.isInWishlist = ids.includes(this.houseId);
    });
  }

  onImageLoad(): void {
    this.imageLoaded = true;
  }

  handleImageError(event: any): void {
    event.target.src = this.defaultImage;
    this.imageLoaded = true;
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.images.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.images.length) % this.images.length;
  }

  toggleWishlist(): void {
    if (!this.accountService.isLoggedIn()) {
      // Redirect to login page if the user is not logged in
      this.router.navigate(['/auth/login']);
      return;
    }

    // Toggle wishlist if the user is logged in
    this.wishlistService.toggleWishlist(this.houseId);
  }

  navigateToDetails(): void {
    this.router.navigate(['/houses', this.houseId]);
  }

  getFirstThreeAmenities(): string[] {
    return this.amenities.slice(0, 3);
  }
}
