import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-house-images',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './house-images.component.html',
  styleUrls: ['./house-images.component.css']
})
export class HouseImagesComponent {
  @Input() images: string[] = [];
  currentImageIndex = 0;

  nextImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  }

  prevImage(): void {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
  }

  selectImage(index: number): void {
    this.currentImageIndex = index;
  }
}