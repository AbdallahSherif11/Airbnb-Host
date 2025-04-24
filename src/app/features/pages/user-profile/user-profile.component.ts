import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/user-profile-services/profile.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../../core/layout/navbar/navbar.component";

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup;
  userData: any;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  isLoading = false;
  isUpdating = false;
  updateSuccess = false;
  updateError = false;

  constructor(
    private profileService: ProfileService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      dateOfBirth: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.profileService.getUserProfile().subscribe({
      next: (data) => {
        this.userData = data;
        this.profileForm.patchValue({
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          dateOfBirth: data.dateOfBirth
        });
        this.previewUrl = data.profilePictureUrl;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.isLoading = false;
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) return;
  
    this.isUpdating = true;
    this.updateSuccess = false;
    this.updateError = false;
  
    // First update profile data
    this.profileService.updateUserProfile(this.profileForm.value).subscribe({
      next: () => {
        // If there's a new image, update it after profile data
        if (this.selectedFile) {
          this.updateProfilePicture();
        } else {
          this.handleSuccess();
        }
      },
      error: (err) => this.handleError(err)
    });
  }
  
  private updateProfilePicture(): void {
    this.profileService.updateProfilePicture(this.selectedFile!).subscribe({
      next: () => this.handleSuccess(),
      error: (err) => this.handleError(err)
    });
  }
  
  private handleSuccess(): void {
    this.isUpdating = false;
    this.updateSuccess = true;
    this.selectedFile = null;
    this.loadUserProfile(); // Refresh user data
  }
  
  private handleError(error: any): void {
    console.error('Error:', error);
    this.isUpdating = false;
    this.updateError = true;
    
    // // You can add more specific error handling here
    // if (error.status === 401) {
    //   // Handle unauthorized error
    // } else if (error.status === 400) {
    //   // Handle bad request (maybe show error message from backend)
    // }
  }
}
