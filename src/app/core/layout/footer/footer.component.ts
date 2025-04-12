import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  selectedLanguage = 'English (US)';
  selectedCurrency = 'USD';
  showLanguageDropdown = false;
  showCurrencyDropdown = false;

  toggleLanguageDropdown() {
    this.showLanguageDropdown = !this.showLanguageDropdown;
    if (this.showLanguageDropdown) {
      this.showCurrencyDropdown = false;
    }
  }

  toggleCurrencyDropdown() {
    this.showCurrencyDropdown = !this.showCurrencyDropdown;
    if (this.showCurrencyDropdown) {
      this.showLanguageDropdown = false;
    }
  }

  selectLanguage(language: string) {
    this.selectedLanguage = language;
    this.showLanguageDropdown = false;
  }

  selectCurrency(currency: string) {
    this.selectedCurrency = currency;
    this.showCurrencyDropdown = false;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.showLanguageDropdown = false;
      this.showCurrencyDropdown = false;
    }
  }
}
