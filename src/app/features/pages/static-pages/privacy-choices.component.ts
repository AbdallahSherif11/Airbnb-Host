import { Component } from '@angular/core';
import { NavbarComponent } from '../../../core/layout/navbar/navbar.component';
import { FooterComponent } from '../../../core/layout/footer/footer.component';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-privacy-choices',
  imports: [NavbarComponent, FooterComponent, NgIf, CommonModule],
  templateUrl: './privacy-choices.component.html',
  styleUrls: ['./privacy-choices.component.css']
})

export class PrivacyChoicesComponent {
  preferences = {
    analyticsCookies: false,
    marketingCookies: false,
    personalizedAds: false,
    analyticsPartners: false,
    promotionalEmails: false,
    newsletter: false
  };

  preferencesSaved = false;  // New state to track if preferences are saved

  onCheckboxChange(event: Event, key: keyof typeof this.preferences): void {
    const input = event.target as HTMLInputElement;
    this.preferences[key] = input.checked;
    console.log(`${key} changed to ${input.checked}`);
  }

  savePreferences(): void {
    console.log('Saved preferences:', this.preferences);
    this.preferencesSaved = true;  // Show the success message
    setTimeout(() => {
      this.preferencesSaved = false;  // Hide after 3 seconds
    }, 3000);
  }
}
