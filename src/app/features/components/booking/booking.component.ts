import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
  imports: [CommonModule, FormsModule],
})
export class BookingComponent implements OnInit {
  @Input() houseId!: number;
  @Input() set pricePerNight(value: number) {
    this._pricePerNight = value;
    this.calculatePrices();
  }
  get pricePerNight(): number {
    return this._pricePerNight;
  }
  private _pricePerNight: number = 45214;

  checkInDate: Date = new Date('2025-06-28');
  checkOutDate: Date = new Date('2025-07-05');
  nights: number = 7;

  // Guest management
  showGuestPopup: boolean = false;
  adults: number = 2;
  children: number = 0;
  infants: number = 0;
  hasServiceAnimal: boolean = false;

  // Calendar management
  showCalendar: boolean = false;
  calendarMode: 'checkin' | 'checkout' = 'checkin';
  currentMonth: Date = new Date();

  // Pricing
  serviceFeePercentage: number = 0.14; // 14% service fee
  taxPercentage: number = 0.03; // 3% tax
  subtotal: number = 0;
  serviceFee: number = 0;
  taxes: number = 0;
  total: number = 0;

  constructor(
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.calculateNights();
    this.calculatePrices();
  }

  get totalGuests(): number {
    return this.adults + this.children;
  }

  toggleGuestPopup(): void {
    this.showGuestPopup = !this.showGuestPopup;
    if (this.showGuestPopup) {
      this.showCalendar = false;
    }
  }

  toggleCalendar(mode: 'checkin' | 'checkout'): void {
    this.calendarMode = mode;
    this.showCalendar = !this.showCalendar;
    if (this.showCalendar) {
      this.showGuestPopup = false;
      this.currentMonth = new Date(this.calendarMode === 'checkin' ? this.checkInDate : this.checkOutDate);
    }
  }

  closeCalendar(): void {
    this.showCalendar = false;
  }

  generateCalendarDays(): (Date | null)[] {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: (Date | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  }

  isSelectedDate(date: Date | null): boolean {
    if (!date) return false;
    return (this.calendarMode === 'checkin' && this.isSameDate(date, this.checkInDate)) ||
           (this.calendarMode === 'checkout' && this.isSameDate(date, this.checkOutDate));
  }

  private isSameDate(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  selectDate(date: Date): void {
    if (this.calendarMode === 'checkin') {
      this.checkInDate = date;
      // Automatically set checkout date to 7 days later
      const checkoutDate = new Date(date);
      checkoutDate.setDate(date.getDate() + this.nights);
      this.checkOutDate = checkoutDate;
    } else {
      // Ensure checkout date is after checkin date
      if (date > this.checkInDate) {
        this.checkOutDate = date;
      } else {
        // If selected date is before checkin, swap them
        this.checkOutDate = this.checkInDate;
        this.checkInDate = date;
      }
    }
    this.calculateNights();
    this.showCalendar = false;
  }

  clearDates(): void {
    this.checkInDate = new Date();
    this.checkOutDate = new Date();
    this.nights = 0;
    this.showCalendar = false;
    this.calculatePrices();
  }

  changeGuests(type: 'adults' | 'children' | 'infants', change: number): void {
    if (type === 'adults') {
      const newValue = this.adults + change;
      if (newValue >= 1 && newValue <= 15 && this.totalGuests + change <= 15) {
        this.adults = newValue;
      }
    } else if (type === 'children') {
      const newValue = this.children + change;
      if (newValue >= 0 && newValue <= 15 && this.totalGuests + change <= 15) {
        this.children = newValue;
      }
    } else if (type === 'infants') {
      const newValue = this.infants + change;
      if (newValue >= 0) {
        this.infants = newValue;
      }
    }
  }

  calculateNights(): void {
    const diffTime = Math.abs(this.checkOutDate.getTime() - this.checkInDate.getTime());
    this.nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    this.calculatePrices();
  }

  calculatePrices(): void {
    this.subtotal = this.pricePerNight * this.nights;
    this.serviceFee = Math.round(this.subtotal * this.serviceFeePercentage);
    this.taxes = Math.round(this.subtotal * this.taxPercentage);
    this.total = this.subtotal + this.serviceFee + this.taxes;
  }

  reserve(): void {
    const bookingData = {
      houseId: this.houseId,
      checkInDate: this.checkInDate.toISOString().split('T')[0],
      checkOutDate: this.checkOutDate.toISOString().split('T')[0],
      paymentMethod: 'Stripe'
    };

    this.bookingService.createBooking(bookingData).subscribe({
      next: () => {
        this.router.navigate(['/payment']);
      },
      error: (error) => {
        console.error('Booking failed:', error);
      }
    });
  }
}
