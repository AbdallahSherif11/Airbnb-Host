import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-date-range-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.css']
})
export class DateRangePickerComponent {
  @Input() checkInDate: Date | null = null;
  @Input() checkOutDate: Date | null = null;
  @Output() datesSelected = new EventEmitter<{checkIn: Date | null, checkOut: Date | null}>();

  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();
  today = new Date();
  todayDate = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());

  prevMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
  }

  selectDate(date: Date): void {
    if (this.isDateDisabled(date)) return;

    if (!this.checkInDate || this.checkInDate > date || 
        (this.checkInDate && this.checkOutDate)) {
      this.checkInDate = date;
      this.checkOutDate = null;
    } else if (this.checkInDate && date > this.checkInDate) {
      this.checkOutDate = date;
    }

    this.datesSelected.emit({
      checkIn: this.checkInDate,
      checkOut: this.checkOutDate
    });
  }

  clearDates(): void {
    this.checkInDate = null;
    this.checkOutDate = null;
    this.datesSelected.emit({ checkIn: null, checkOut: null });
  }

  isDateDisabled(date: Date): boolean {
    return date < this.todayDate;
  }

  isDateSelected(date: Date): boolean {
    if (!this.checkInDate) return false;
    if (!this.checkOutDate) return this.isSameDate(date, this.checkInDate);
    
    return date >= this.checkInDate && date <= this.checkOutDate;
  }

  isCheckIn(date: Date): boolean {
    return this.checkInDate ? this.isSameDate(date, this.checkInDate) : false;
  }

  isCheckOut(date: Date): boolean {
    return this.checkOutDate ? this.isSameDate(date, this.checkOutDate) : false;
  }

  isSameDate(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  getMonthDays(monthOffset: number = 0): Date[][] {
    const displayMonth = (this.currentMonth + monthOffset) % 12;
    const displayYear = this.currentYear + Math.floor((this.currentMonth + monthOffset) / 12);
    
    const firstDay = new Date(displayYear, displayMonth, 1);
    const lastDay = new Date(displayYear, displayMonth + 1, 0);
    
    const weeks: Date[][] = [];
    let week: Date[] = [];
    
    for (let i = 0; i < firstDay.getDay(); i++) {
      week.push(new Date(0));
    }
    
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(displayYear, displayMonth, day);
      week.push(date);
      
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }
    
    if (week.length > 0) {
      while (week.length < 7) {
        week.push(new Date(0));
      }
      weeks.push(week);
    }
    
    return weeks;
  }

  getMonthName(monthOffset: number = 0): string {
    const month = (this.currentMonth + monthOffset) % 12;
    const year = this.currentYear + Math.floor((this.currentMonth + monthOffset) / 12);
    return new Date(year, month, 1).toLocaleString('default', { month: 'long' }) + ' ' + year;
  }

  getDayClasses(day: Date): string {
    let classes = 'h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium';
    
    if (this.isDateDisabled(day)) {
      classes += ' opacity-50 cursor-not-allowed';
    } else {
      classes += ' hover:bg-gray-100';
    }

    if (this.isDateSelected(day)) {
      if (this.isCheckIn(day) || this.isCheckOut(day)) {
        classes += ' bg-black text-white';
      } else {
        classes += ' bg-gray-100';
      }
    }

    if (this.isCheckIn(day) && this.checkOutDate) {
      classes += ' rounded-r-none';
    } else if (this.isCheckOut(day)) {
      classes += ' rounded-l-none';
    } else if (this.isDateSelected(day) && !this.isCheckIn(day) && !this.isCheckOut(day)) {
      classes += ' rounded-none';
    }

    return classes;
  }
}