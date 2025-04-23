import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private baseUrl = 'https://myairbnb.runasp.net/api/Account';

  constructor(private http: HttpClient) { }

  getUserProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  updateUserProfile(profileData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/profile`, profileData);
  }

  updateProfilePicture(image: File): Observable<any> {
    const formData = new FormData();
    formData.append('profilePicture', image, image.name);
    
    return this.http.put(`${this.baseUrl}/profile-picture`, formData, {
      responseType: 'text' // Tell Angular to expect text response
    }).pipe(
      map(response => {
        // Convert successful text response to an object
        return { success: true, message: response };
      }),
      catchError(error => {
        console.error('Profile picture upload error:', error);
        return throwError(() => error);
      })
    );
  }
}
