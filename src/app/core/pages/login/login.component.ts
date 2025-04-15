import { Component, OnDestroy, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AccountService } from '../../services/account/account.service';
import { LoginUser } from '../../interfaces/account/login-user';
import { NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {
  errorMessage: string | null = null;

  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ])
  });

  isLoading = false;
  private loginSubscription: Subscription | null = null;

  private authService = inject(AccountService);
  private router = inject(Router);

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    if (this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = null;

    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }

    const userInfo: LoginUser = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!
    };

    this.loginSubscription = this.authService.loginUser(userInfo)
      .subscribe({
        next: (response) => {
          localStorage.setItem('authToken', response.token);
          this.router.navigate(['/']);
          this.isLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          if (error.status === 401) {
            this.errorMessage = 'Invalid credentials. Please try again.';
          } else {
            this.errorMessage = 'An error occurred. Please try again later.';
          }
          console.error('Login error:', error);
        }
      });
  }

  ngOnDestroy() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }
}