
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Component } from '@angular/core';
@Component({
  selector: 'app-filter',
  imports: [NgFor,CommonModule,FormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
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
  ];

 
}
