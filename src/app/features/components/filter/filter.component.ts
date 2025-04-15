import { Component, ElementRef, ViewChild, HostListener, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [NgFor, CommonModule, FormsModule],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements AfterViewInit, OnDestroy {
  categories = [
    { name: 'Ryokans', icon: 'fas fa-hotel' },
    { name: 'Boats', icon: 'fas fa-ship' },
    { name: 'Minsus', icon: 'fas fa-house-user' },
    { name: 'Creative spaces', icon: 'fas fa-palette' },
    { name: 'Casas particulares', icon: 'fas fa-archway' },
    { name: 'Grand pianos', icon: 'fas fa-music' },
    { name: 'Treehouses', icon: 'fas fa-tree' },
    { name: 'Yurts', icon: 'fas fa-campground' },
    { name: 'Barns', icon: 'fas fa-warehouse' },
    { name: 'Towers', icon: 'fas fa-building' },
    { name: 'Domes', icon: 'fas fa-circle' },
    { name: 'ahmed', icon: 'fas fa-tree' },
    { name: 'ayman', icon: 'fas fa-campground' },
    { name: 'saif', icon: 'fas fa-warehouse' },
    { name: 'nada', icon: 'fas fa-building' },
    { name: 'abdallah', icon: 'fas fa-circle' },
  ];

  // Price range slider variables
  minRange = 0;
  maxRange = 5000;
  minValue = 200;
  maxValue = 4000;
  step = 10;
  activeHandle: 'min' | 'max' | null = null;
  isMinHovered = false;
  isMaxHovered = false;

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  @ViewChild('sliderContainer') sliderContainer!: ElementRef;
  isScrolledToStart = true;
  isScrolledToEnd = false;
  scrollAmount = 300;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.checkScrollPosition();
      });
    });
  }

  // Category scroll methods
  scrollLeft() {
    this.scrollContainer.nativeElement.scrollBy({
      left: -this.scrollAmount,
      behavior: 'smooth'
    });
    setTimeout(() => this.checkScrollPosition(), 300);
  }

  scrollRight() {
    this.scrollContainer.nativeElement.scrollBy({
      left: this.scrollAmount,
      behavior: 'smooth'
    });
    setTimeout(() => this.checkScrollPosition(), 300);
  }

  checkScrollPosition() {
    if (!this.scrollContainer?.nativeElement) return;
    
    const element = this.scrollContainer.nativeElement;
    const threshold = 5;
    
    const newIsScrolledToStart = element.scrollLeft <= threshold;
    const newIsScrolledToEnd = element.scrollLeft + element.clientWidth >= element.scrollWidth - threshold;

    if (newIsScrolledToStart !== this.isScrolledToStart || newIsScrolledToEnd !== this.isScrolledToEnd) {
      this.ngZone.run(() => {
        this.isScrolledToStart = newIsScrolledToStart;
        this.isScrolledToEnd = newIsScrolledToEnd;
      });
    }
  }

  // Price range slider methods
  startDrag(event: PointerEvent, handle: 'min' | 'max') {
    if (typeof document === 'undefined') return;

    this.activeHandle = handle;
    const sliderElement = this.sliderContainer.nativeElement;
    const sliderRect = sliderElement.getBoundingClientRect();
    
    const moveHandler = (moveEvent: PointerEvent) => {
      const offsetX = moveEvent.clientX - sliderRect.left;
      const percentage = Math.min(Math.max(offsetX / sliderRect.width, 0), 1);
      const newValue = Math.round(this.minRange + percentage * (this.maxRange - this.minRange));
      const steppedValue = Math.round(newValue / this.step) * this.step;

      this.ngZone.run(() => {
        if (this.activeHandle === 'min') {
          this.minValue = Math.max(this.minRange, Math.min(steppedValue, this.maxValue - this.step));
        } else {
          this.maxValue = Math.min(this.maxRange, Math.max(steppedValue, this.minValue + this.step));
        }
      });
    };

    const stopHandler = () => {
      document.removeEventListener('pointermove', moveHandler);
      document.removeEventListener('pointerup', stopHandler);
      this.activeHandle = null;
    };

    document.addEventListener('pointermove', moveHandler);
    document.addEventListener('pointerup', stopHandler);
    
    event.preventDefault();
    event.stopPropagation();
  }

  moveHandle(handle: 'min' | 'max', delta: number) {
    this.ngZone.run(() => {
      if (handle === 'min') {
        this.minValue = Math.max(this.minRange, Math.min(this.minValue + delta, this.maxValue - this.step));
      } else {
        this.maxValue = Math.min(this.maxRange, Math.max(this.maxValue + delta, this.minValue + this.step));
      }
    });
  }

  ngOnDestroy() {
    if (typeof document === 'undefined') return;
    // Cleanup is handled in the stopHandler
  }
}