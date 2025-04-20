import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../services/wishlist-service/wishlist.service';
import { HouseCardComponent } from '../../components/house-card/house-card.component';
import { NavbarComponent } from "../../../core/layout/navbar/navbar.component";
import { FooterComponent } from "../../../core/layout/footer/footer.component";
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AccountService } from '../../../core/services/account/account.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, HouseCardComponent, NavbarComponent, FooterComponent, FormsModule, RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent {
  private wishlistService = inject(WishlistService);
  private accountService = inject(AccountService);
  searchQuery: string = '';
  wishlist$ = this.wishlistService.wishlist$;
  allHouseData: any[] = [];
  isLoading = true;
  router: any;

  constructor() {
    if (this.accountService.isLoggedIn()) {
      this.wishlistService.getMyWishlist().subscribe({
        next: (data) => {
          this.allHouseData = data;
        //   console.log('📦 Wishlist house data:', this.allHouseData);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('❌ Error loading wishlist data:', err);
          this.isLoading = false;
        }
      });
    } else {
      console.warn('User is not logged in. Skipping wishlist fetch.');
      this.isLoading = false;
    }
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], {
        queryParams: { q: this.searchQuery }
      });
    }
  }
}
