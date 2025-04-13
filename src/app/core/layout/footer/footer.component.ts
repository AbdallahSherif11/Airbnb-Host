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
  languageDropdownClasses = 'bottom-full mb-2';
  currencyDropdownClasses = 'bottom-full mb-2';

  toggleLanguageDropdown(event?: MouseEvent) {
    this.showLanguageDropdown = !this.showLanguageDropdown;
    
    if (this.showLanguageDropdown) {
      this.showCurrencyDropdown = false;
      this.calculateDropdownPosition(event, 'language');
    }
  }

  toggleCurrencyDropdown(event?: MouseEvent) {
    this.showCurrencyDropdown = !this.showCurrencyDropdown;
    
    if (this.showCurrencyDropdown) {
      this.showLanguageDropdown = false;
      this.calculateDropdownPosition(event, 'currency');
    }
  }

  private calculateDropdownPosition(event: MouseEvent | undefined, type: 'language' | 'currency') {
    setTimeout(() => {
      if (!event) return;
      
      const button = event.target as HTMLElement;
      const dropdown = button.closest('.relative')?.querySelector('.absolute') as HTMLElement;
      if (!dropdown) return;
      
      const buttonRect = button.getBoundingClientRect();
      const dropdownHeight = dropdown.offsetHeight;
      const spaceBelow = window.innerHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      
      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        // Open upwards
        if (type === 'language') {
          this.languageDropdownClasses = 'bottom-full mb-2';
        } else {
          this.currencyDropdownClasses = 'bottom-full mb-2';
        }
      } else {
        // Open downwards
        if (type === 'language') {
          this.languageDropdownClasses = 'top-full mt-2';
        } else {
          this.currencyDropdownClasses = 'top-full mt-2';
        }
      }
    }, 0);
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