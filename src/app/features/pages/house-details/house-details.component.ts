import { Component, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HouseService } from '../../services/house-services/house.service';
import { MessageService } from '../../services/message-services/message.service';
import { HouseImagesComponent } from '../../components/house-images/house-images.component';
import { NavbarComponent } from "../../../core/layout/navbar/navbar.component";
import { FooterComponent } from "../../../core/layout/footer/footer.component";
import { BookingComponent } from "../../components/booking/booking.component";
import { HouseMapComponent } from '../../components/house-map/house-map.component';
import { DateRangePickerComponent } from '../../components/date-range-picker/date-range-picker.component';
import { AmenitiesComponent } from '../../components/amenities/amenities.component';
import { ReviewsComponent } from '../../components/reviews/reviews.component';
import { HostDetailsComponent } from '../../components/host-details/host-details.component';

@Component({
  selector: 'app-house-details',
  standalone: true,
  imports: [
    CommonModule, 
    HouseImagesComponent, 
     
     
    BookingComponent, 
    HouseMapComponent, 
    DateRangePickerComponent, 
    AmenitiesComponent, 
    ReviewsComponent,
    HostDetailsComponent
  ],
  templateUrl: './house-details.component.html',
  styleUrls: ['./house-details.component.css']
})
export class HouseDetailsComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private houseService = inject(HouseService);
  private messageService = inject(MessageService);
  private _PLATFORM_ID = inject(PLATFORM_ID);

  houseId: number = 0;  
  house: any;
  isLoading = true;
  error: string | null = null;
  checkInDate: Date | null = null;
  checkOutDate: Date | null = null;
  pricePerNight: number = 0;
  unavailableDates: Date[] = [];
  maxGuests: number = 0;
  maxDays: number = 0;

  ngOnInit(): void {
    if(isPlatformBrowser(this._PLATFORM_ID)){
      this.route.params.subscribe(params => {
        this.houseId = +params['id'];
        this.loadHouseDetails();
      });
    }
  }

  loadHouseDetails(): void {
    this.houseService.getHouseById(this.houseId).subscribe({
      next: (house) => {
        this.house = house;
        this.pricePerNight = house?.pricePerNight ?? 0;
        this.maxGuests = (house as any)?.maxGuests ?? 0;
        this.maxDays = (house as any)?.maxDays ?? 0;
        this.loadUnavailableDates();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load house details. Please try again later.';
        this.isLoading = false;
        console.error('Error loading house:', err);
      }
    });
  }

  loadUnavailableDates(): void {
    if (this.house?.bookings) {
      this.unavailableDates = this.house.bookings.flatMap((booking: any) => {
        const dates = [];
        const start = new Date(booking.checkIn);
        const end = new Date(booking.checkOut);
        for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
          dates.push(new Date(dt));
        }
        return dates;
      });
    }
  }

  onDatesSelected(event: {checkIn: Date | null, checkOut: Date | null}): void {
    this.checkInDate = event.checkIn;
    this.checkOutDate = event.checkOut;
  }

  startConversation(): void {
    this.messageService.startConversation(this.houseId).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/chat', response.hostId]);
        }
      },
      error: (err) => {
        console.error('Error starting conversation:', err);
      }
    });
  }
}