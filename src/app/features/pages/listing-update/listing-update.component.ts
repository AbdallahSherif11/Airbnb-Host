import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SafeUrlPipe } from '../../pipes/safe-url/safe-url.pipe';
import { House } from '../../services/house-services/house.service';
import { UpdateHouseService } from '../../services/update-house-services/update-house.service';
import { HouseService } from '../../services/house-services/house.service'; // Add this import


@Component({
  selector: 'app-listing-update',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeUrlPipe],
  templateUrl: './listing-update.component.html',
  styleUrls: ['./listing-update.component.css']
})
export class ListingUpdateComponent implements OnInit {
  currentStep = 1;
  totalSteps = 3;
  isLoading = false;
  errorMessage = '';
  houseId!: number;
  originalHouse!: House;

  listing = {
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
    imagesList: [] as File[],
    amenitiesList: [] as number[],
    existingImages: [] as string[]
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

  constructor(
    private updateHouseService: UpdateHouseService,
    private houseService: HouseService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  // ngOnInit(): void {
  //   this.route.params.subscribe(params => {
  //     this.houseId = +params['id'];
  //     // Here you would fetch the existing house data
  //     // For example:
  //     // this.houseService.getHouseById(this.houseId).subscribe(house => {
  //     //   this.originalHouse = house;
  //     //   this.populateForm(house);
  //     // });
  //   });
  // }
  _PLATFORM_ID = inject(PLATFORM_ID);

  ngOnInit(): void {
    if(isPlatformBrowser(this._PLATFORM_ID)){

        this.route.params.subscribe(params => {
          this.houseId = +params['id'];
          this.loadHouseData();
        });
    }
  }

  

  loadHouseData(): void {
    this.isLoading = true;
    this.houseService.getHouseById(this.houseId).subscribe({
      next: (house) => {
        this.originalHouse = house;
        this.populateForm(house);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading house data:', err);
        this.errorMessage = 'Failed to load house data. Please try again.';
        this.isLoading = false;
      }
    });
  }

  populateForm(house: House): void {
    const amenityIds = house.amenities
      .map(amenityName => {
        const found = this.amenities.find(a => a.name === amenityName);
        return found ? found.id : null;
      })
      .filter(id => id !== null) as number[];
  
    this.listing = {
      title: house.title,
      description: house.description,
      pricePerNight: house.pricePerNight,
      country: house.country,
      city: house.city,
      street: house.street,
      latitude: house.latitude || 0,
      longitude: house.longitude || 0,
      isAvailable: house.isAvailable !== undefined ? house.isAvailable : true,
      maxDays: house.maxDays || 30, 
      maxGuests: house.maxGuests || 1,  
      houseView: house.houseView || '',
      numberOfRooms: house.numberOfRooms,
      numberOfBeds: house.numberOfBeds,
      imagesList: [],
      amenitiesList: amenityIds,
      existingImages: house.images
    };
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
        return (this.listing.imagesList.length >= 0 || this.listing.existingImages.length > 0) &&
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

  removeExistingPhoto(index: number) {
    this.listing.existingImages.splice(index, 1);
    // Note: You might need to call an API to actually delete the image from storage
  }

  async submitUpdates() {
    if (!this.isStepValid(3)) return;

    this.isLoading = true;
    this.errorMessage = '';

    try {
      // Update title
      await this.updateHouseService.updateTitle(this.houseId, this.listing.title).toPromise();

      // Update description
      await this.updateHouseService.updateDescription(this.houseId, this.listing.description).toPromise();

      // Update price
      await this.updateHouseService.updatePrice(this.houseId, this.listing.pricePerNight).toPromise();

      // Update location
      await this.updateHouseService.updateLocation(this.houseId, {
        country: this.listing.country,
        city: this.listing.city,
        street: this.listing.street,
        latitude: this.listing.latitude,
        longitude: this.listing.longitude
      }).toPromise();

      // Update availability and basic details
      await this.updateHouseService.updateAvailability(this.houseId, {
        isAvailable: this.listing.isAvailable,
        maxDays: this.listing.maxDays,
        maxGuests: this.listing.maxGuests,
        houseView: this.listing.houseView,
        numberOfRooms: this.listing.numberOfRooms,
        numberOfBeds: this.listing.numberOfBeds
      }).toPromise();

      // Update images if new ones were added
      if (this.listing.imagesList.length > 0) {
        await this.updateHouseService.updateImages(this.houseId, this.listing.imagesList).toPromise();
      }

      // Update amenities
      await this.updateHouseService.updateAmenities(this.houseId, this.listing.amenitiesList).toPromise();

      this.router.navigate(['/myhouses']);
    } catch (error) {
      console.error('Error updating listing:', error);
      this.errorMessage = 'Failed to update listing. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}
