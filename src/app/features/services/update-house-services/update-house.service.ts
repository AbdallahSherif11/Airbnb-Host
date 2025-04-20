import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UpdateHouseService {
  private apiUrl = 'https://localhost:7015/api/House';

  constructor(private http: HttpClient) { }

  // Update title (fixed string serialization)
  updateTitle(houseId: number, title: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/title?Houseid=${houseId}`, 
      JSON.stringify(title),
      { 
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    ).pipe(
      catchError(this.handleError<any>('updateTitle'))
    );
  }

  // Update description (fixed string serialization)
  updateDescription(houseId: number, description: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/description?Houseid=${houseId}`, 
      JSON.stringify(description),
      { 
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    ).pipe(
      catchError(this.handleError<any>('updateDescription'))
    );
  }

  // Update price (fixed decimal serialization)
  updatePrice(houseId: number, pricePerNight: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/PricePerNight?Houseid=${houseId}`, 
      pricePerNight, // Send the number directly
      { 
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    ).pipe(
      catchError(this.handleError<any>('updatePrice'))
    );
  }

  // Update location
  updateLocation(houseId: number, location: {
    country: string;
    city: string;
    street: string;
    latitude: number;
    longitude: number;
  }): Observable<any> {
    return this.http.put(`${this.apiUrl}/Location?Houseid=${houseId}`, 
      location,
      { 
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    ).pipe(
      catchError(this.handleError<any>('updateLocation'))
    );
  }

  // Update availability and basic details
  updateAvailability(houseId: number, data: {
    isAvailable: boolean;
    maxDays: number;
    maxGuests: number;
    houseView: string;
    numberOfRooms: number;
    numberOfBeds: number;
  }): Observable<any> {
    return this.http.put(`${this.apiUrl}/Availability?Houseid=${houseId}`, 
      data,
      { 
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    ).pipe(
      catchError(this.handleError<any>('updateAvailability'))
    );
  }

  // Update images
  updateImages(houseId: number, images: File[]): Observable<any> {
    const formData = new FormData();
    images.forEach(file => {
      formData.append('images', file, file.name);
    });
    return this.http.put(`${this.apiUrl}/Images?Houseid=${houseId}`, formData).pipe(
      catchError(this.handleError<any>('updateImages'))
    );
  }

  // Update amenities
  updateAmenities(houseId: number, amenityIds: number[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/amenities?Houseid=${houseId}`, 
      {
        houseId,
        amenityIds
      },
      { 
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    ).pipe(
      catchError(this.handleError<any>('updateAmenities'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}