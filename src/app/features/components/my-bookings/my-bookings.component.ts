import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { DatePipe } from '@angular/common';
import { NavbarComponent } from '../../../core/layout/navbar/navbar.component';
import { FooterComponent } from '../../../core/layout/footer/footer.component';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css'],
  providers: [DatePipe, NavbarComponent, FooterComponent],
  imports: [FooterComponent, NavbarComponent]
})
export class MyBookingsComponent implements OnInit {
  bookings: any[] = [];
  isLoading = true;
  error: string | null = null;
  totalEarnings = 0;

  constructor(
    private bookingService: BookingService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadHostBookings();
  }

  loadHostBookings(): void {
    this.bookingService.getBookingsAsHost().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.totalEarnings = this.bookingService.calculateTotalEarnings(bookings);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load bookings. Please try again later.';
        this.isLoading = false;
        console.error('Error loading bookings:', err);
      }
    });
  }

  formatDate(dateString: string): string {
    return this.datePipe.transform(dateString, 'MMM d, y') || '';
  }

  getDuration(checkIn: string, checkOut: string): number {
    const diffTime = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}