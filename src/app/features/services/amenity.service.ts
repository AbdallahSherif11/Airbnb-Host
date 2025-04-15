import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { House } from './house-services/house.service';

@Injectable({
  providedIn: 'root'
})
export class AmenityService {
  private apiUrl = 'https://localhost:7015/api/House';

  constructor(private http: HttpClient) { }

  getAmenities(houseId: number): Observable<string[]> {
    return this.http.get<House>(`${this.apiUrl}/${houseId}`).pipe(
      map((house: House) => {

        return (house as any)?.amenities || [];
      }),
      catchError(this.handleError<string[]>('getAmenities', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
