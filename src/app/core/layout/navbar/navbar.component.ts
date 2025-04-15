import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AccountService } from '../../services/account/account.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private accountService = inject(AccountService);
  private router = inject(Router);

  get isLoggedIn(): boolean {
    return this.accountService.isLoggedIn();
  }

  signOut(): void {
    this.accountService.signOut();
    this.router.navigate(['/home']);
  }
}