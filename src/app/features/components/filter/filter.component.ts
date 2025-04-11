import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import * as noUiSlider from 'nouislider';
@Component({
  selector: 'app-filter',
  imports: [NgFor,CommonModule,FormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent implements AfterViewInit{
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
    { name: 'Treehouses', icon: 'fas fa-tree' },
    { name: 'Yurts', icon: 'fas fa-campground' },
    { name: 'Barns', icon: 'fas fa-warehouse' },
    { name: 'Towers', icon: 'fas fa-building' },
    { name: 'Domes', icon: 'fas fa-circle' },
  ];
  
  @ViewChild('rangeSlider', { static: false }) slider!: ElementRef;
  async ngAfterViewInit() {
    if (typeof window !== 'undefined') {
      const noUiSlider = (await import('nouislider')).default;
      const slider = noUiSlider.create(this.slider.nativeElement, {
        start: [1142, 28000],
        connect: true,
        range: {
          min: 1142,
          max: 28000
        },
        format: {
          to: function (value: number) {
            return '$' + Math.round(value).toLocaleString();
          },
          from: function (value: string) {
            return Number(value.replace(/[^0-9.-]+/g,""));
          }
        }
      });

      // Update displayed values when slider moves
      slider.on('update', (values: (string | number)[], handle: number) => {
        const minValueElement = document.getElementById('min-value');
        const maxValueElement = document.getElementById('max-value');
        
        if (minValueElement) minValueElement.textContent = values[0] as string;
        if (maxValueElement) maxValueElement.textContent = values[1] as string;
      });
    }
  }
}