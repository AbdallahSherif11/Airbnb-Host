import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../services/payment-services/payment.service';

@Component({
  selector: 'app-payment-cancel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div class="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <!-- Cancel Icon -->
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>

        <h2 class="text-center text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h2>
        <p class="text-center text-gray-600 mb-6">
          Your payment was not completed. No charges have been made.
        </p>

        <div class="flex gap-4">
          <button
            (click)="goToHome()"
            class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition"
          >
            Back to Home
          </button>
          <!-- <button
            (click)="retryPayment()"
            class="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-2 px-4 rounded-md transition"
          >
            Try Again
          </button> -->
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class PaymentCancelComponent {
    stripeSessionId: string | null = null;
    constructor(private route: ActivatedRoute, private paymentService: PaymentService, private router: Router) {
        this.route.queryParams.subscribe(params => {
          this.stripeSessionId = params['session_id'] || null; // From Stripe redirect
        });
      }

      

  goToHome() {
    this.router.navigate(['/home']);
  }

  retryPayment() {
    if (this.stripeSessionId) {
      this.paymentService.redirectToStripe(this.stripeSessionId);
    } else {
      this.router.navigate(['/']); 
    }
  }
}