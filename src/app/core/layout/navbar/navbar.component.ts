import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HouseService } from '../../../features/services/house-services/house.service';
import { AccountService } from '../../services/account/account.service';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private accountService = inject(AccountService);
  private router = inject(Router);
  private houseService = inject(HouseService);

  searchKeyword = '';
  showMobileSearch = false;

  get isLoggedIn(): boolean {
    return this.accountService.isLoggedIn();
  }

  get currentUserEmail(): string | null {
    return this.accountService.currentUserEmail();
  }

  toggleMobileSearch(): void {
    this.showMobileSearch = !this.showMobileSearch;
  }

  search(): void {
    if (this.searchKeyword.trim()) {

      this.router.navigate(['search'], {
        queryParams: { q: this.searchKeyword },
        queryParamsHandling: 'merge' 
      });
      this.searchKeyword = '';
      this.showMobileSearch = false;
    }
  }

  signOut(): void {
    this.accountService.signOut();
  }
}
