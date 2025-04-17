import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface House {
  houseId: number;
  title: string;
  description: string;
  pricePerNight: number;
  country: string;
  city: string;
  street: string;
  images: string[];
  amenities: string[];
  numberOfRooms: number;
  numberOfBeds: number;
  rating: number;
  hostName: string;
  isGuestFavorite: boolean;
  dateRange: string;
}

@Injectable({ providedIn: 'root' })
export class HouseService {
  private apiUrl = 'https://localhost:7015/api/House';

  constructor(private http: HttpClient) {}

  getAllHouses(): Observable<House[]> {
    return this.http.get<House[]>(this.apiUrl).pipe(
      catchError(this.handleError<House[]>('getAllHouses', []))
    );
  }

  getHouseById(id: number): Observable<House | undefined> {
    return this.http.get<House>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError<House>('getHouseById'))
    );
  }

  searchHouses(keyword: string): Observable<House[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search?keyword=${keyword}`).pipe(
      tap(response => console.log('API Response:', response)), // for debugging
      map(response => this.transformHouseData(response)),
      catchError(this.handleError<House[]>('searchHouses', []))
    );
  }

  private transformHouseData(response: any[]): House[] {
    return response.map(item => {
      // احتساب الـ Rating من الـ Reviews لو موجودة
      const reviews = item.reviews || [];
      let rating = item.rating || 0;

      if (reviews.length > 0) {
        rating = reviews.reduce((sum: number, review: any) => sum + (review.rating || 0), 0) / reviews.length;
      }

      // تحديد isGuestFavorite بناءً على الـ Rating المحسوب أو القيمة اللي جاية من الـ API
      const isGuestFavorite = item.isGuestFavorite !== undefined
        ? item.isGuestFavorite
        : rating > 4.5;

      return {
        houseId: item.houseId || 0,
        title: item.title || 'Untitled Property',
        description: item.description || '',
        pricePerNight: item.pricePerNight || 0,
        country: item.country || 'Unknown Country',
        city: item.city || 'Unknown City',
        street: item.street || '',
        images: item.images || ['assets/default-house.jpg'],
        amenities: item.amenities || [],
        numberOfRooms: item.numberOfRooms || 0,
        numberOfBeds: item.numberOfBeds || 0,
        rating: rating,
        hostName: item.hostName || 'Host',
        isGuestFavorite: isGuestFavorite,
        dateRange: item.createdAt ? `Added ${new Date(item.createdAt).toLocaleDateString()}` : ''
      };
    });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }


  getHousesByView(view: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/view/${view}`);
  }

  getMyHouses(): Observable<House[]> {
  return this.http.get<House[]>(`${this.apiUrl}/my-houses`).pipe(
    map(response => this.transformHouseData(response)),
    catchError(this.handleError<House[]>('getMyHouses', []))
  );
}
}


