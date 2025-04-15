import { Component,OnInit } from '@angular/core';
import { NavbarComponent } from '../../../core/layout/navbar/navbar.component';
import { FooterComponent } from '../../../core/layout/footer/footer.component';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
@Component({
  selector: 'app-terms',
  imports: [NavbarComponent,FooterComponent],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.css'
})
export class TermsComponent implements OnInit {
  constructor(
    private titleService: Title,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Terms of Service - Airbnb Clone');
    this.smoothScrollToAnchor();
  }

  private smoothScrollToAnchor(): void {
    this.router.events.subscribe(() => {
      if (location.hash) {
        setTimeout(() => {
          const element = document.querySelector(location.hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    });
  }
}
