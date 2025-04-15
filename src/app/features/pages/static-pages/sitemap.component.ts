import { Component,OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavbarComponent } from '../../../core/layout/navbar/navbar.component';
import { FooterComponent } from '../../../core/layout/footer/footer.component';

@Component({
  selector: 'app-sitemap',
  imports: [NavbarComponent,FooterComponent],
  templateUrl: './sitemap.component.html',
  styleUrl: './sitemap.component.css'
})
export class SitemapComponent implements OnInit {
  constructor(private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('Sitemap - Airbnb Clone');
  }
}
