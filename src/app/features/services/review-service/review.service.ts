// review.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from '../../../core/services/account/account.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'https://myairbnb.runasp.net/api/Review';

  constructor(
    private http: HttpClient,
    private authService: AccountService
  ) { }

  getReviewsByHouseId(houseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/house/${houseId}`);
  }

  createReview(review: {
    guestId: string;
    bookingId: number;
    houseId: number;
    rating: number;
    comment: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}`, review);
  }

  

  updateReview(reviewId: number, rating: number, comment: string): Observable<any> {
    const dto = {
      id: reviewId,
      rating,
      comment
    };
    return this.http.put(this.apiUrl, dto);
  }

  deleteReview(reviewId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${reviewId}`);
  }
}
