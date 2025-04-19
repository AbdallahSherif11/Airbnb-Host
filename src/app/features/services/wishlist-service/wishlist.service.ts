import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private baseUrl = 'https://localhost:7015/api/WishList';

  private wishlistIdsSubject = new BehaviorSubject<number[]>([]);
  wishlist$ = this.wishlistIdsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialWishlist();
  }

  private loadInitialWishlist() {
    this.getMyWishlist().subscribe({
      next: (houses) => {
       
        const ids = houses.map(house => house.houseId); 
        this.wishlistIdsSubject.next(ids);
      },
      error: (err) => {
        console.error('❌ Failed to load wishlist:', err);
      }
    });
  }

  getMyWishlist() {
    return this.http.get<any[]>(`${this.baseUrl}/my-wishlist`);
  }

  isFavorite(houseId: number): boolean {
    return this.wishlistIdsSubject.getValue().includes(houseId);
  }

  toggleWishlist(houseId: number) {
    const isFav = this.isFavorite(houseId);

    if (isFav) {
      this.removeFromWishlist(houseId).subscribe({
        next: () => {
          const updated = this.wishlistIdsSubject.getValue().filter(id => id !== houseId);
          this.wishlistIdsSubject.next(updated);
        },
        error: (err) => {
          console.error('❌ Failed to remove from wishlist:', err);
        }
      });
    } else {
      this.addToWishlist(houseId).subscribe({
        next: () => {
          const updated = [...this.wishlistIdsSubject.getValue(), houseId];
          this.wishlistIdsSubject.next(updated);
        },
        error: (err) => {
          console.error('❌ Failed to add to wishlist:', err);
        }
      });
    }
  }

  addToWishlist(houseId: number) {
    return this.http.post(`${this.baseUrl}/add/${houseId}`, {});
  }

  removeFromWishlist(houseId: number) {
    return this.http.delete(`${this.baseUrl}/remove/${houseId}`);
  }
}
