import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CreateBookingDto } from '../interfaces/booking-create-DTO/create-booking-dto';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private apiUrl = 'https://localhost:7015/api/Booking';

  constructor(private http: HttpClient) { }

  createBooking(bookingData: CreateBookingDto): Observable<any> {
    return this.http.post(this.apiUrl, bookingData).pipe(
      catchError(this.handleError<any>('createBooking'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  getBookingsAsGuest(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/AsGuest`)
      .pipe(catchError(this.handleError<any[]>('getBookingsAsGuest', [])));
  }


  getBookingsAsHost(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/AsHost`)
      .pipe(catchError(this.handleError<any[]>('getBookingsAsHost', [])));
  }

 
  
}
