import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SafeUrlPipe } from '../../pipes/safe-url/safe-url.pipe';
import { House } from '../../services/house-services/house.service';
import { UpdateHouseService } from '../../services/update-house-services/update-house.service';
import { HouseService } from '../../services/house-services/house.service';

@Component({
  selector: 'app-listing-update',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeUrlPipe],
  templateUrl: './listing-update.component.html',
  styleUrls: ['./listing-update.component.css']
})
export class ListingUpdateComponent implements OnInit {
  isLoadingPropertyDetails = false;
  isLoadingTitleDescription = false;
  isLoadingPricing = false;
  isLoadingAmenities = false;
  isLoadingPhotos = false;
  isLoadingAvailability = false;

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
    this.houseService.getHouseById(this.houseId).subscribe({
      next: (house) => {
        this.originalHouse = house;
        this.populateForm(house);
      },
      error: (err) => {
        console.error('Error loading house data:', err);
        this.errorMessage = 'Failed to load house data. Please try again.';
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

  // Validation methods
  isPropertyDetailsValid(): boolean {
    return !!this.listing.houseView &&
           !!this.listing.country &&
           !!this.listing.city &&
           !!this.listing.street &&
           this.listing.maxGuests > 0 &&
           this.listing.numberOfRooms > 0 &&
           this.listing.numberOfBeds > 0;
  }

  isTitleDescriptionValid(): boolean {
    return !!this.listing.title && !!this.listing.description;
  }

  isPricingValid(): boolean {
    return this.listing.pricePerNight > 0;
  }

  // Save methods
  async savePropertyDetails() {
    if (!this.isPropertyDetailsValid()) return;

    this.isLoadingPropertyDetails = true;
    this.errorMessage = '';

    try {
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

    } catch (error) {
      console.error('Error updating property details:', error);
      this.errorMessage = 'Failed to update property details. Please try again.';
    } finally {
      this.isLoadingPropertyDetails = false;
    }
  }

  async saveTitleDescription() {
    if (!this.isTitleDescriptionValid()) return;

    this.isLoadingTitleDescription = true;
    this.errorMessage = '';

    try {
      // Update title
      await this.updateHouseService.updateTitle(this.houseId, this.listing.title).toPromise();

      // Update description
      await this.updateHouseService.updateDescription(this.houseId, this.listing.description).toPromise();

    } catch (error) {
      console.error('Error updating title & description:', error);
      this.errorMessage = 'Failed to update title & description. Please try again.';
    } finally {
      this.isLoadingTitleDescription = false;
    }
  }

  async savePricing() {
    if (!this.isPricingValid()) return;

    this.isLoadingPricing = true;
    this.errorMessage = '';

    try {
      // Update price
      await this.updateHouseService.updatePrice(this.houseId, this.listing.pricePerNight).toPromise();

    } catch (error) {
      console.error('Error updating pricing:', error);
      this.errorMessage = 'Failed to update pricing. Please try again.';
    } finally {
      this.isLoadingPricing = false;
    }
  }

  async saveAmenities() {
    this.isLoadingAmenities = true;
    this.errorMessage = '';

    try {
      // Update amenities
      await this.updateHouseService.updateAmenities(this.houseId, this.listing.amenitiesList).toPromise();

    } catch (error) {
      console.error('Error updating amenities:', error);
      this.errorMessage = 'Failed to update amenities. Please try again.';
    } finally {
      this.isLoadingAmenities = false;
    }
  }

  async savePhotos() {
    if (this.listing.imagesList.length === 0 && this.listing.existingImages.length === 0) return;

    this.isLoadingPhotos = true;
    this.errorMessage = '';

    try {
      // Update images if new ones were added
      if (this.listing.imagesList.length > 0) {
        await this.updateHouseService.updateImages(this.houseId, this.listing.imagesList).toPromise();
      }

    } catch (error) {
      console.error('Error updating photos:', error);
      this.errorMessage = 'Failed to update photos. Please try again.';
    } finally {
      this.isLoadingPhotos = false;
    }
  }

  async saveAvailability() {
    this.isLoadingAvailability = true;
    this.errorMessage = '';

    try {
      // Update availability
      await this.updateHouseService.updateAvailability(this.houseId, {
        isAvailable: this.listing.isAvailable,
        maxDays: this.listing.maxDays,
        maxGuests: this.listing.maxGuests,
        houseView: this.listing.houseView,
        numberOfRooms: this.listing.numberOfRooms,
        numberOfBeds: this.listing.numberOfBeds
      }).toPromise();

    } catch (error) {
      console.error('Error updating availability:', error);
      this.errorMessage = 'Failed to update availability. Please try again.';
    } finally {
      this.isLoadingAvailability = false;
    }
  }

  // Existing methods
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
}