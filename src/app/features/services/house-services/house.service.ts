import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


export interface House {
    hostId: string;
    houseId: number;
    title: string;
    description: string;
    pricePerNight: number;
    country: string;
    city: string;
    street: string;
    images: string[];
    amenities: string[];
    // TO DO : Add other properties you need from ReadHouseDTO
}

@Injectable({ providedIn: 'root' })
export class HouseService {
    private apiUrl = 'https://localhost:7015/api/House';

    constructor(private http: HttpClient) { }

    getAllHouses(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl).pipe(
          catchError(this.handleError<any[]>('getAllHouses', []))
        );
      }

      private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
          console.error(`${operation} failed: ${error.message}`);
          return of(result as T);
        };
      }

      getHouseById(id: number): Observable<House> {
        return this.http.get<House>(`${this.apiUrl}/${id}`).pipe(
          catchError(this.handleError<House>('getHouseById'))
        );
      }


}


