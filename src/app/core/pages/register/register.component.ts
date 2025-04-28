import { Component, OnDestroy } from "@angular/core";
import { FormControl, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
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

    private passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
        const password = control.get('password');
        const confirmPassword = control.get('confirmPassword');
    
        if (!password || !confirmPassword || password.value === confirmPassword.value) {
          return null;
        }
    
        confirmPassword.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      };

  registerForm = new FormGroup({
    userName: new FormControl('', [
      Validators.required,
      Validators.minLength(5)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      this.createPasswordStrengthValidator()
    ]),
    confirmPassword: new FormControl('', [
      Validators.required
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
  }, { validators: this.passwordMatchValidator });

  apiError: string = '';
  isLoading: boolean = false;
  passwordStrength: number = 0;
  private apiSubscription: Subscription | null = null;

  constructor(
    private authService: AccountService,
    private router: Router
  ) {}

 

  private createPasswordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumeric = /[0-9]/.test(value);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
      const hasMinLength = value.length >= 8;

      const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar && hasMinLength;

      return !passwordValid ? { passwordStrength: true } : null;
    };
  }

  updatePasswordStrength() {
    const password = this.registerForm.get('password')?.value || '';
    let strength = 0;

    // Length check
    if (password.length >= 8) strength++;

    // Lowercase check
    if (/[a-z]/.test(password)) strength++;

    // Uppercase check
    if (/[A-Z]/.test(password)) strength++;

    // Number/special char check
    if (/[0-9]/.test(password) || /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;

    this.passwordStrength = strength;
  }

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

    this.apiSubscription = this.authService.registerUserWithConfirmation(requestBody)
      .subscribe({
        next: (res) => {
          console.log('Registration successful', res);
          this.router.navigate(['/auth/confirm-email']); // Redirect to confirmation page
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
      if (err.error?.message?.includes('Email')) {
        this.apiError = 'Email address is already registered';
      } else if (err.error?.message?.includes('Username')) {
        this.apiError = 'Username is already taken';
      } else if (err.error?.message?.includes('National ID')) {
        this.apiError = 'National ID is already registered';
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