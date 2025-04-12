import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from "../../services/account/account.service";
import { NgIf } from "@angular/common";
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

    constructor(private _authService: AccountService, private router: Router) {}
  registerForm: FormGroup = new FormGroup({
    userName: new FormControl('', [
      Validators.required,
      Validators.minLength(5)  
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),  
    //   Validators.pattern('(?=.*[0-9])(?=.*[a-zA-Z])') 
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

//   _authService = inject(AccountService);

  register() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      
     
      const body = {
        userName: formData.userName,
        password: formData.password,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        PhoneNumber: formData.phoneNumber,
        nationalId: formData.nationalId,
        isAgreed: formData.isAgreed ? "True" : "False" // تحويل الـ boolean إلى string
      };

      this._authService.registerUser(body).subscribe({
        next: (res) => {
            console.log('Registration successful', res);
            // Navigate to login page after successful registration
            this.router.navigate(['/auth/login']); 
          },
        error: (err) => {
          console.log(err);
        },
        complete: () => {}
      });
    } else {
      console.log('Form is invalid');
      this.registerForm.markAllAsTouched(); 
    }
  }
}