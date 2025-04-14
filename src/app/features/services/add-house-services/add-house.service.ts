import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AddHouseService {
  private apiUrl = 'https://localhost:7015/api/House';

  constructor(private http: HttpClient) { }

  createHouse(houseData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, houseData).pipe(
      catchError(this.handleError<any>('createHouse'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}