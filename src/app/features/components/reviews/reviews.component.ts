import { Component, Input, OnInit } from '@angular/core';
import { AccountService } from '../../../core/services/account/account.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { ReviewService } from '../../services/review-service/review.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {
  @Input() reviews: any[] = [];
  @Input({ required: true }) houseId!: number;

  userBookings: any[] = [];
  canAddReview = false;
  isLoggedIn = false;
  currentUserId: string | null = null;
  showReviewForm = false;
  reviewForm: FormGroup;

  constructor(
    private reviewService: ReviewService,
    private bookingService: BookingService,
    private accountService: AccountService,
    private fb: FormBuilder
  ) {
    this.reviewForm = this.fb.group({
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.checkAuthStatus();
    if (this.isLoggedIn && this.currentUserId) {
      this.loadBookingsAndReviews();
    }
  }

  checkAuthStatus(): void {
    this.isLoggedIn = this.accountService.isLoggedIn();
    if (this.isLoggedIn) {
      this.currentUserId = this.accountService.getUserId();
    }
  }

  loadBookingsAndReviews(): void {
    // Load bookings first
    this.bookingService.getBookingsAsGuest().subscribe({
      next: (bookings) => {
        this.userBookings = bookings.filter(b => b.houseId === this.houseId);

        // Then load reviews
        this.reviewService.getReviewsByHouseId(this.houseId).subscribe({
          next: (reviews) => {
            this.reviews = reviews;
            this.checkReviewEligibility();
          },
          error: (err) => console.error('Error loading reviews:', err)
        });
      },
      error: (err) => console.error('Error loading bookings:', err)
    });
  }

  checkReviewEligibility(): void {
    const reviewedBookingIds = new Set(this.reviews.map(r => r.bookingId));
    const unreviewedBookings = this.userBookings.filter(b => !reviewedBookingIds.has(b.bookingId));
  
    console.log('== CHECKING ELIGIBILITY ==');
    console.log('Reviewed Booking IDs:', reviewedBookingIds);
    console.log('User Bookings for this house:', this.userBookings);
    console.log('Unreviewed Bookings:', unreviewedBookings);
  
    this.canAddReview = this.isLoggedIn && unreviewedBookings.length > 0;
  }

  toggleReviewForm(): void {
    this.showReviewForm = !this.showReviewForm;
    if (this.showReviewForm) {
      this.reviewForm.reset({ rating: 5, comment: '' });
    }
  }

  submitReview(): void {
    if (this.reviewForm.valid && this.currentUserId) {
      const reviewedBookingIds = new Set(this.reviews.map(r => r.bookingId));
      const unreviewedBooking = this.userBookings.find(b => !reviewedBookingIds.has(b.bookingId));

      if (!unreviewedBooking) return;

      const reviewData = {
        guestId: this.currentUserId,
        bookingId: unreviewedBooking.bookingId,
        houseId: this.houseId,
        rating: this.reviewForm.value.rating,
        comment: this.reviewForm.value.comment
      };

      this.reviewService.createReview(reviewData).subscribe({
        next: () => {
          this.loadBookingsAndReviews();
          this.showReviewForm = false;
        },
        error: (err) => console.error('Error submitting review:', err)
      });
    }
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - rating).fill(0);
  }

  trackByReviewId(index: number, review: any): number {
    return review.reviewId;
  }


  get averageRating(): number {
    if (!this.reviews.length) return 0;
    const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    return parseFloat((total / this.reviews.length).toFixed(1));
  }
  
  get fullStars(): number[] {
    return Array(Math.floor(this.averageRating)).fill(0);
  }
  
  get halfStar(): boolean {
    return this.averageRating % 1 >= 0.5;
  }
  
  get emptyStars(): number[] {
    const totalFull = Math.floor(this.averageRating);
    const totalEmpty = 5 - totalFull - (this.halfStar ? 1 : 0);
    return Array(totalEmpty).fill(0);
  }
  
}
