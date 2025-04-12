import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HouseCardComponent } from '../house-card/house-card.component';

@Component({
    selector: 'app-house-list',
    standalone: true,
    imports: [CommonModule, HouseCardComponent],
    templateUrl: './house-list.component.html',
    styleUrls: ['./house-list.component.css']
})
export class HouseListComponent {
    // Sample data - replace with your actual data source
    houses = [
        {
            images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'],
            title: 'Modern Beach Villa',
            hostType: 'Superhost',
            dateRange: 'Jun 15-20',
            price: 245,
            rating: 4.85
        },
        {
            images: [
                'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            ],
            title: 'Mountain Cabin',
            hostType: 'Business host',
            dateRange: 'Jul 10-15',
            price: 180,
            rating: 4.92
        },
        {
            images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'],
            title: 'Modern Beach Villa',
            hostType: 'Superhost',
            dateRange: 'Jun 15-20',
            price: 245,
            rating: 4.85
        },
        {
            images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'],
            title: 'Modern Beach Villa',
            hostType: 'Superhost',
            dateRange: 'Jun 15-20',
            price: 245,
            rating: 4.85
        },
        {
            images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'],
            title: 'Modern Beach Villa',
            hostType: 'Superhost',
            dateRange: 'Jun 15-20',
            price: 245,
            rating: 4.85
        },
        {
            images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'],
            title: 'Modern Beach Villa',
            hostType: 'Superhost',
            dateRange: 'Jun 15-20',
            price: 245,
            rating: 4.85
        },
        {
            images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'],
            title: 'Modern Beach Villa',
            hostType: 'Superhost',
            dateRange: 'Jun 15-20',
            price: 245,
            rating: 4.85
        },
        {
            images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'],
            title: 'Modern Beach Villa',
            hostType: 'Superhost',
            dateRange: 'Jun 15-20',
            price: 245,
            rating: 4.85
        },
        {
            images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'],
            title: 'Modern Beach Villa',
            hostType: 'Superhost',
            dateRange: 'Jun 15-20',
            price: 245,
            rating: 4.85
        },
        {
            images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'],
            title: 'Modern Beach Villa',
            hostType: 'Superhost',
            dateRange: 'Jun 15-20',
            price: 245,
            rating: 4.85
        },
        {
            images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'],
            title: 'Modern Beach Villa',
            hostType: 'Superhost',
            dateRange: 'Jun 15-20',
            price: 245,
            rating: 4.85
        },
        {
            images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'],
            title: 'Modern Beach Villa',
            hostType: 'Superhost',
            dateRange: 'Jun 15-20',
            price: 245,
            rating: 4.85
        },
        {
            images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'],
            title: 'Modern Beach Villa',
            hostType: 'Superhost',
            dateRange: 'Jun 15-20',
            price: 245,
            rating: 4.85
        },
        // Add more houses as needed...
    ];
}