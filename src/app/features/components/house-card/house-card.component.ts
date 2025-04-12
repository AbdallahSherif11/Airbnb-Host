// house-card.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-house-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './house-card.component.html',
  styleUrls: ['./house-card.component.css']
})
export class HouseCardComponent {
  @Input() images: string[] = [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  ];
  
  @Input() title: string = 'Cazarilh, France';
  @Input() hostType: string = 'Business host';
  @Input() dateRange: string = 'Jul 14 - 19';
  @Input() price: number = 112;
  @Input() rating: number = 4.96;
  @Input() isGuestFavorite: boolean = true;

  currentSlide = 0;
  isInWishlist = false;

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.images.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.images.length) % this.images.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  toggleWishlist(): void {
    this.isInWishlist = !this.isInWishlist;
  }
}