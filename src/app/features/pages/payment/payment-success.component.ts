import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div class="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <!-- Success Icon -->
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        <h2 class="text-center text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
        <p class="text-center text-gray-600 mb-6">
          Your booking is confirmed. A receipt has been sent to your email.
        </p>

        <!-- Booking Summary -->
        <div *ngIf="booking" class="border-t border-gray-200 pt-4 mt-4">
          <h3 class="text-lg font-medium text-gray-900 mb-3">Booking Details</h3>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">Dates:</span>
              <span class="font-medium">{{ booking.checkInDate | date }} - {{ booking.checkOutDate | date }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Total:</span>
              <span class="font-medium">{{ (booking.totalPrice * 1.17) | currency:'USD' }}</span>
            </div>
          </div>
        </div>

        <button
          (click)="goToHome()"
          class="mt-6 w-full bg-rose-500 hover:bg-rose-600 text-white py-2 px-4 rounded-md transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  `,
  styles: []
})
export class PaymentSuccessComponent {
  booking: any;

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['session_id']) {
        this.loadLatestBooking();
      }
    });
  }

  loadLatestBooking() {
    this.bookingService.getBookingsAsGuest().subscribe(bookings => {
      if (bookings && bookings.length > 0) {
        this.booking = bookings[bookings.length-1]; // Get most recent booking
      }
    });
  }

  goToHome() {
    this.router.navigate(['/home']);
  }
}