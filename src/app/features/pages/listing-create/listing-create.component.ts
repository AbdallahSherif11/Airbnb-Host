// listing-create.component.ts
import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateHouseDTO } from '../../interfaces/house-create-DTO/create-house-dto';
import { AddHouseService } from '../../services/add-house-services/add-house.service';
import { SafeUrlPipe } from '../../pipes/safe-url/safe-url.pipe';
import * as L from 'leaflet';

@Component({
  selector: 'app-listing-create',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeUrlPipe],
  templateUrl: './listing-create.component.html',
  styleUrls: ['./listing-create.component.css']
})
export class ListingCreateComponent implements AfterViewInit, OnDestroy {
  currentStep = 1;
  totalSteps = 3;
  isLoading = false;
  errorMessage = '';

  listing: Omit<CreateHouseDTO, 'HostId'> = {
    title: '',
    description: '',
    pricePerNight: 0,
    country: '',
    city: '',
    street: '',
    latitude: 0,
    longitude: 0,
    isAvailable: true,
    maxDays: 30,
    maxGuests: 1,
    houseView: '',
    numberOfRooms: 1,
    numberOfBeds: 1,
    imagesList: [],
    amenitiesList: []
  };

  propertyTypes = [
  'Desert', 'Camping', 'Mountain', 'City',
    'Farms', 'Boats', 'Beach',
    'Lake', 'Room', 'Towers','Barns', 'forest',
  ];


  amenities = [
    { id: 1, name: 'Wifi' },
    { id: 2, name: 'Hair Dryer' },
    { id: 3, name: 'Dryer' },
    { id: 4, name: 'Kitchen' },
    { id: 5, name: 'Parking' },
    { id: 6, name: 'TV' },
    { id: 7, name: 'Pool' },
    { id: 8, name: 'Washer' },
    { id: 9, name: 'Air Conditioning' },
    { id: 10, name: 'Lake access' },
    { id: 11, name: 'Bathtub' },
    { id: 12, name: 'Gym' }
    
  ];

  private map: L.Map | null = null;
  private marker: L.Marker | null = null;

  constructor(
    private addHouseService: AddHouseService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  private initializeMap(): void {
    this.map = L.map('location-map').setView([0, 0], 2); // Default view (world map)

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Handle map click to set marker and update latitude/longitude
    this.map.on('click', (event: L.LeafletMouseEvent) => {
      const { lat, lng } = event.latlng;

      // Update marker position
      if (this.marker) {
        this.marker.setLatLng([lat, lng]);
      } else {
        if (this.map) {
          this.marker = L.marker([lat, lng], { draggable: true }).addTo(this.map);
        }

        // Allow dragging the marker to update location
        this.marker?.on('dragend', () => {
          const position = this.marker?.getLatLng();
          if (position) {
            this.updateLocation(position.lat, position.lng);
          }
        });
      }

      // Update form fields
      this.updateLocation(lat, lng);
    });
  }

  private updateLocation(lat: number, lng: number): void {
    this.listing.latitude = lat;
    this.listing.longitude = lng;
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  nextStep() {
    if (this.currentStep < this.totalSteps && this.isStepValid(this.currentStep)) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  isStepValid(step: number): boolean {
    switch(step) {
      case 1:
        return !!this.listing.houseView &&
               !!this.listing.country &&
               !!this.listing.city &&
               !!this.listing.street &&
               this.listing.maxGuests > 0 &&
               this.listing.numberOfRooms > 0 &&
               this.listing.numberOfBeds > 0;
      case 2:
        return this.listing.imagesList.length >= 5 &&
               !!this.listing.title &&
               !!this.listing.description;
      case 3:
        return this.listing.pricePerNight > 0;
      default:
        return false;
    }
  }

  toggleAmenity(amenityId: number) {
    const index = this.listing.amenitiesList.indexOf(amenityId);
    if (index === -1) {
      this.listing.amenitiesList.push(amenityId);
    } else {
      this.listing.amenitiesList.splice(index, 1);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.listing.imagesList = Array.from(input.files);
    }
  }

  removePhoto(index: number) {
    this.listing.imagesList.splice(index, 1);
  }

  async submitListing() {
    if (!this.isStepValid(3)) return;

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const formData = this.createFormData();
      await this.addHouseService.createHouse(formData).toPromise();
      this.router.navigate(['/myhouses']);
    } catch (error) {
      console.error('Error submitting listing:', error);
      this.errorMessage = 'Failed to create listing. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  private createFormData(): FormData {
    const formData = new FormData();

    // Append all properties except imagesList and amenitiesList
    Object.keys(this.listing).forEach(key => {
      if (key !== 'imagesList' && key !== 'amenitiesList') {
        formData.append(key, (this.listing as any)[key]);
      }
    });

    // Append each image
    this.listing.imagesList.forEach((file, index) => {
      formData.append(`imagesList`, file, file.name);
    });

    // Append each amenity ID
    this.listing.amenitiesList.forEach(id => {
      formData.append('amenitiesList', id.toString());
    });

    return formData;
  }
}
