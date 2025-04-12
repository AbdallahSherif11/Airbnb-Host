import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AccountService } from '../../services/account/account.service';
import { LoginUser } from '../../interfaces/account/login-user';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({
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
  errorMessage: string | null = null;

  private _authService = inject(AccountService);
  private _router = inject(Router);

  login() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      const userInfo: LoginUser = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this._authService.loginUser(userInfo).subscribe({
        next: (response) => {
          // Store token 
          localStorage.setItem('authToken', response.token);
          
          // Redirect to home
          this._router.navigate(['/']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}