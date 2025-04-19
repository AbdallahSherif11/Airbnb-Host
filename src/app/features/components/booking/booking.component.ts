import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class BookingComponent implements OnChanges {
  @Input() houseId!: number;
  @Input() pricePerNight!: number;
  @Input() checkInDate: Date | null = null;
  @Input() checkOutDate: Date | null = null;
  @Input() unavailableDates: Date[] = [];
  @Input() maxGuests!: number;
  @Input() maxDays!: number;
  @Output() datesSelected = new EventEmitter<{checkIn: Date | null, checkOut: Date | null}>();

  nights: number = 0;
  showGuestPopup: boolean = false;
  adults: number = 2;
  children: number = 0;
  infants: number = 0;
  hasServiceAnimal: boolean = false;
  showCalendar: boolean = false;
  calendarMode: 'checkin' | 'checkout' = 'checkin';
  currentMonth: Date = new Date();
  serviceFeePercentage: number = 0.14;
  taxPercentage: number = 0.03;
  subtotal: number = 0;
  serviceFee: number = 0;
  taxes: number = 0;
  total: number = 0;

  constructor(
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnChanges(): void {
    if (this.checkInDate && this.checkOutDate) {
      this.calculateNights();
    }
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
      this.currentMonth = new Date(this.calendarMode === 'checkin' ? 
        (this.checkInDate || new Date()) : 
        (this.checkOutDate || new Date()));
    }
  }

  closeCalendar(): void {
    this.showCalendar = false;
  }

  prevMonth(): void {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() - 1,
      1
    );
  }

  nextMonth(): void {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      1
    );
  }

  generateCalendarDays(): (Date | null)[] {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: (Date | null)[] = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  }

  isSelectedDate(date: Date | null): boolean {
    if (!date) return false;
    
    // Check if date matches either check-in or check-out based on calendar mode
    if (this.calendarMode === 'checkin') {
      return this.checkInDate ? this.isSameDate(date, this.checkInDate) : false;
    } else {
      return this.checkOutDate ? this.isSameDate(date, this.checkOutDate) : false;
    }
}

  isDateUnavailable(date: Date | null): boolean {
    if (!date) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return date < today || this.unavailableDates.some(d => 
      d.getFullYear() === date.getFullYear() &&
      d.getMonth() === date.getMonth() &&
      d.getDate() === date.getDate()
    );
  }

selectDate(date: Date): void {
  if (this.isDateUnavailable(date)) return;

  if (this.calendarMode === 'checkin') {
    this.checkInDate = date;
    if (!this.checkOutDate || date >= this.checkOutDate) {
      const checkoutDate = new Date(date);
      checkoutDate.setDate(date.getDate() + 1);
      this.checkOutDate = checkoutDate;
    }
  } else {
    if (date > (this.checkInDate || new Date(0))) {
      this.checkOutDate = date;
    } else {
      this.checkOutDate = this.checkInDate;
      this.checkInDate = date;
    }
  }

  // Update the selected dates in the BookingService
  this.bookingService.updateSelectedDates({ checkIn: this.checkInDate, checkOut: this.checkOutDate });

  this.datesSelected.emit({ checkIn: this.checkInDate, checkOut: this.checkOutDate });
  this.calculateNights();
}

  clearDates(): void {
    this.datesSelected.emit({ checkIn: null, checkOut: null });
    this.showCalendar = false;
  }

  changeGuests(type: 'adults' | 'children' | 'infants', change: number): void {
    if (type === 'adults') {
      const newValue = this.adults + change;
      if (newValue >= 1 && newValue <= this.maxGuests && this.totalGuests + change <= this.maxGuests) {
        this.adults = newValue;
      }
    } else if (type === 'children') {
      const newValue = this.children + change;
      if (newValue >= 0 && newValue <= this.maxGuests && this.totalGuests + change <= this.maxGuests) {
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
    if (this.checkInDate && this.checkOutDate) {
      const diffTime = Math.abs(this.checkOutDate.getTime() - this.checkInDate.getTime());
      this.nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      this.calculatePrices();
    } else {
      this.nights = 0;
      this.calculatePrices();
    }
  }

  calculatePrices(): void {
    this.subtotal = this.pricePerNight * this.nights;
    this.serviceFee = Math.round(this.subtotal * this.serviceFeePercentage);
    this.taxes = Math.round(this.subtotal * this.taxPercentage);
    this.total = this.subtotal + this.serviceFee + this.taxes;
  }

  private isSameDate(date1: Date | null, date2: Date | null): boolean {
    if (!date1 || !date2) return false;
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

  reserve(): void {
    if (!this.checkInDate || !this.checkOutDate) {
      alert('Please select check-in and check-out dates');
      return;
    }

    if (this.totalGuests > this.maxGuests) {
      alert(`Maximum ${this.maxGuests} guests allowed`);
      return;
    }

    if (this.nights > this.maxDays) {
      alert(`Maximum stay is ${this.maxDays} nights`);
      return;
    }

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
        alert('Booking failed. Please try again.');
      }
    });
  }
}