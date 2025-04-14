import { Component, OnDestroy } from "@angular/core";
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from "../../services/account/account.service";
import { Router, RouterLink } from "@angular/router";
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnDestroy {
  registerForm = new FormGroup({
    userName: new FormControl('', [
      Validators.required,
      Validators.minLength(5)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    firstName: new FormControl('', [
      Validators.required,
      Validators.maxLength(40)
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.maxLength(40)
    ]),
    dateOfBirth: new FormControl('', [
      Validators.required,
      Validators.pattern('\\d{4}-\\d{2}-\\d{2}')
    ]),
    address: new FormControl('', [
      Validators.required,
      Validators.maxLength(255)
    ]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{11}$')
    ]),
    nationalId: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{14}$')
    ]),
    isAgreed: new FormControl(false, [
      Validators.requiredTrue
    ])
  });

  apiError: string = '';
  isLoading: boolean = false;
  private apiSubscription: Subscription | null = null;

  constructor(
    private authService: AccountService,
    private router: Router
  ) {}

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.apiError = 'Please fill all required fields correctly';
      return;
    }

    if (this.isLoading) return;

    this.apiError = '';
    this.isLoading = true;

    // Cancel previous subscription if exists
    if (this.apiSubscription) {
      this.apiSubscription.unsubscribe();
    }

    const formData = this.registerForm.value;
    const requestBody = {
      userName: formData.userName!,
      password: formData.password!,
      email: formData.email!,
      firstName: formData.firstName!,
      lastName: formData.lastName!,
      dateOfBirth: formData.dateOfBirth!,
      address: formData.address!,
      PhoneNumber: formData.phoneNumber!,
      nationalId: formData.nationalId!,
      isAgreed: formData.isAgreed ? "True" : "False"
    };

    this.apiSubscription = this.authService.registerUser(requestBody)
      .subscribe({
        next: (res) => {
          console.log('Registration successful', res);
          this.router.navigate(['/auth/login']);
        },
        error: (err: HttpErrorResponse) => {
          this.handleApiError(err);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  private handleApiError(err: HttpErrorResponse) {
    console.error('Registration error', err);
    this.isLoading = false;

    if (err.status === 0) {
      this.apiError = 'Network error. Please check your internet connection.';
    } else if (err.status === 400) {
      // Handle validation errors from server
      if (err.error?.errors) {
        const validationErrors = [];
        for (const field in err.error.errors) {
          validationErrors.push(...err.error.errors[field]);
        }
        this.apiError = validationErrors.join('\n');
      } else {
        this.apiError = err.error?.message || 'Invalid data provided';
      }
    } else if (err.status === 409) {
      // Handle duplicate user case
      if (err.error?.message?.includes('email')) {
        this.apiError = 'Email address is already registered';
      } else if (err.error?.message?.includes('username')) {
        this.apiError = 'Username is already taken';
      } else {
        this.apiError = 'User already exists with these details';
      }
    } else {
      this.apiError = err.error?.message || 'An unexpected error occurred';
    }
  }

  ngOnDestroy() {
    if (this.apiSubscription) {
      this.apiSubscription.unsubscribe();
    }
  }
}