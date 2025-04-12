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
      Validators.minLength(5)  // حد أدنى 5 أحرف لاسم المستخدم
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),  // حد أدنى 8 أحرف
    //   Validators.pattern('(?=.*[0-9])(?=.*[a-zA-Z])')  // يجب أن تحتوي على أرقام وحروف
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email  // يجب أن يكون البريد الإلكتروني صالحًا
    ]),
    firstName: new FormControl('', [
      Validators.required,
      Validators.maxLength(40)  // الحد الأقصى 40 حرفًا
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.maxLength(40)  // الحد الأقصى 40 حرفًا
    ]),
    dateOfBirth: new FormControl('', [
      Validators.required,
      Validators.pattern('\\d{4}-\\d{2}-\\d{2}')  // تاريخ الميلاد بتنسيق YYYY-MM-DD
    ]),
    address: new FormControl('', [
      Validators.required,
      Validators.maxLength(255)  // الحد الأقصى 255 حرفًا
    ]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{11}$')  // رقم الهاتف يجب أن يتكون من 11 رقمًا
    ]),
    nationalId: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{14}$')  // الرقم القومي يجب أن يتكون من 14 رقمًا
    ]),
    isAgreed: new FormControl(false, [
      Validators.requiredTrue  // يجب تحديد الـ checkbox
    ])
  });

//   _authService = inject(AccountService);

  register() {
    if (this.registerForm.valid) { // تأكد من صحة الفورم قبل الإرسال
      const formData = this.registerForm.value;
      
      // تحويل قيمة isAgreed من boolean إلى string
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
      this.registerForm.markAllAsTouched();  // لتفعيل جميع رسائل الخطأ
    }
  }
}