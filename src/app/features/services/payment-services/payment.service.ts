// payment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private stripePromise: Promise<Stripe | null>;
  private apiUrl = 'https://localhost:7015/api/Payment';

  constructor(private http: HttpClient) {
    this.stripePromise = loadStripe("pk_test_51RBF7PFLZXyLNUqbULRx99zTsJp1gjd2pwiAATxOcSTitBffKlCiLnQpguzKV43uKPXB9XwiVfN7KYppluPHU1nw0038Lswuhe");
  }

  async createCheckoutSession(bookingId: number, amount: number): Promise<void> {
    const stripe = await this.stripePromise;
    
    this.http.post<{url: string, sessionId: string}>(
      `${this.apiUrl}/create-checkout-session`, 
      { bookingId, amount }
    ).subscribe({
      next: async (response) => {
        if (response.sessionId && stripe) {
          const result = await stripe.redirectToCheckout({
            sessionId: response.sessionId // Use the direct session ID
          });
          
          if (result.error) {
            alert(`Payment error: ${result.error.message}`);
          }
        }
      },
      error: (err) => {
        console.error('Error creating checkout session:', err);
        alert('Failed to initiate payment. Please try again.');
      }
    });
}

async redirectToStripe(sessionId: string): Promise<void> {
    const stripe = await this.stripePromise;
    if (stripe) {
      const result = await stripe.redirectToCheckout({
        sessionId: sessionId  // Reuse the same session ID
      });
      if (result.error) {
        alert(`Error: ${result.error.message}`);
      }
    }
  }
}