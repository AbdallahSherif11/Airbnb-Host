import { Component, Input, OnInit } from '@angular/core';
import { AmenityService } from '../../services/amenity.service';

@Component({
  selector: 'app-amenities',
  templateUrl: './amenities.component.html',
  styleUrls: ['./amenities.component.css']
})
export class AmenitiesComponent implements OnInit {
  @Input() houseId!: number;
  amenities: Amenity[] = [];
  displayedAmenities: Amenity[] = [];
  isLoading = true;
  error: string | null = null;
  showModal = false;

  private iconMap: { [key: string]: string } = {
    'Wi-Fi': 'fa-wifi',
    'Hair Dryer': 'fa-wind',
    'Dryer': 'fa-fan',
    'Kitchen': 'fa-utensils',
    'Parking': 'fa-parking',
    'TV': 'fa-tv',
    'Pool': 'fa-swimming-pool',
    'Washer': 'fa-soap',
    'Air Conditioning': 'fa-snowflake',
    'Lake access': 'fa-water',
    'Bathtub': 'fa-bath',
    'Gym': 'fa-dumbbell',
    'Elevator': 'fa-elevator',
    'Fireplace': 'fa-fire',
    'Balcony': 'fa-columns',
    'Barbecue': 'fa-drumstick-bite',
    'Sauna': 'fa-hot-tub',
    'Garden': 'fa-leaf',
    'Security': 'fa-shield-alt',
    'Hot Tub': 'fa-hot-tub',
    'Pet Friendly': 'fa-paw',
    'Heating': 'fa-thermometer-half',
    'Iron': 'fa-tshirt',
    'Bluetooth Sound System': 'fa-bluetooth',
    'Air Conditioing': 'fa-snowflake'
  };

  constructor(private amenityService: AmenityService) {}

  ngOnInit(): void {
    this.loadAmenities();
  }

  private loadAmenities(): void {
    this.isLoading = true;
    this.error = null;

    this.amenityService.getAmenities(this.houseId).subscribe({
      next: (amenityNames) => {
        this.amenities = amenityNames.map(name => ({
          name,
          icon: this.getAmenityIcon(name),
          available: true
        }));
        this.displayedAmenities = this.amenities.slice(0, 4);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load amenities. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  toggleModal(): void {
    this.showModal = !this.showModal;
  }

  private getAmenityIcon(amenityName: string): string {
    const matchedKey = Object.keys(this.iconMap).find(key =>
      amenityName.toLowerCase().includes(key.toLowerCase())
    );
    return matchedKey ? this.iconMap[matchedKey] : 'fa-check';
  }
}

interface Amenity {
  name: string;
  icon: string;
  available: boolean;
}

