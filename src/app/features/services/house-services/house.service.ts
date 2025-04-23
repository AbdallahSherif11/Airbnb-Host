import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


export interface House {

    //   hostId: string;
      houseId: number;
      title: string;
      description: string;
      pricePerNight: number;
      country: string;
      city: string;
      street: string;
      latitude: number;  
      longitude: number; 
      isAvailable: boolean; 
      maxDays: number; 
      maxGuests: number; 
      houseView: string; 
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
  private apiUrl = 'https://myairbnb.runasp.net/api/House';

  constructor(private http: HttpClient) {}

  getAllHouses(): Observable<House[]> {
    return this.http.get<House[]>(this.apiUrl).pipe(
      catchError(this.handleError<House[]>('getAllHouses', []))
    );
  }

  // getHouseById(id: number): Observable<House | undefined> {
  //   return this.http.get<House>(`${this.apiUrl}/${id}`).pipe(
  //     catchError(this.handleError<House>('getHouseById'))
  //   );
  // }

  getHouseById(id: number): Observable<House> {
    return this.http.get<House>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError<House>('getHouseById', this.getDefaultHouse()))
    );
  }

  private getDefaultHouse(): House {
    return {
      houseId: 0,
      title: 'Untitled Property',
      description: '',
      pricePerNight: 0,
      country: 'Unknown Country',
      city: 'Unknown City',
      street: '',
      latitude: 0,
      longitude: 0,
      isAvailable: false,
      maxDays: 0,
      maxGuests: 0,
      houseView: 'Unknown View',
      images: ['assets/default-house.jpg'],
      amenities: [],
      numberOfRooms: 0,
      numberOfBeds: 0,
      rating: 0,
      hostName: 'Host',
      isGuestFavorite: false,
      dateRange: ''
    };
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
            latitude: item.latitude || 0,
            longitude: item.longitude || 0,
            isAvailable: item.isAvailable !== undefined ? item.isAvailable : false,
            maxDays: item.maxDays || 0,
            maxGuests: item.maxGuests || 0,
            houseView: item.houseView || 'Unknown View',
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

getHousesByPriceRange(minPrice: number, maxPrice: number): Observable<House[]> {
  return this.http.get<House[]>(`${this.apiUrl}/price?minPrice=${minPrice}&maxPrice=${maxPrice}`).pipe(
    map(response => this.transformHouseData(response)),
    catchError(this.handleError<House[]>('getHousesByPriceRange', []))
  );
}

getSuggestions(query: string): Observable<any[]> {
  return this.http.get<any[]>(`/api/houses/suggestions?q=${query}`);
}
}


