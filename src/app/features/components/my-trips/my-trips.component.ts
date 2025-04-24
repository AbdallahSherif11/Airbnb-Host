import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { DatePipe } from '@angular/common';
import { NavbarComponent } from '../../../core/layout/navbar/navbar.component';
import { FooterComponent } from '../../../core/layout/footer/footer.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-trips',
  templateUrl: './my-trips.component.html',
  styleUrls: ['./my-trips.component.css'],
  providers: [DatePipe],
  imports: [ FooterComponent, RouterLink]
})
export class MyTripsComponent implements OnInit {
  bookings: any[] = [];
  isLoading = true;
  error: string | null = null;
  totalSpent = 0;

  constructor(
    private bookingService: BookingService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadGuestBookings();
  }

  loadGuestBookings(): void {
    this.bookingService.getBookingsAsGuest().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.totalSpent = this.bookingService.calculateTotalEarnings(bookings);

        // Fetch host names for each booking
        this.bookings.forEach((booking) => {
          this.bookingService.getHostByHouseId(booking.houseId).subscribe({
            next: (host) => {
              booking.hostName = `${host.firstName} ${host.lastName}`;
            },
            error: (err) => {
              console.error(`Failed to fetch host for house ID ${booking.houseId}:`, err);
              booking.hostName = 'Unknown Host';
            }
          });
        });

        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load your trips. Please try again later.';
        this.isLoading = false;
        console.error('Error loading trips:', err);
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