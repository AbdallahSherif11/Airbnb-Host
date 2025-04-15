import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HouseService } from '../../services/house-services/house.service';
import { HouseImagesComponent } from '../../components/house-images/house-images.component';
import { NavbarComponent } from "../../../core/layout/navbar/navbar.component";
import { FooterComponent } from "../../../core/layout/footer/footer.component";
import { AuthLayoutComponent } from "../../../core/layout/auth-layout/auth-layout.component";
import { BookingComponent } from "../../components/booking/booking.component";
import { AmenitiesComponent } from "../../components/amenities/amenities.component";

@Component({
  selector: 'app-house-details',
  standalone: true,
  imports: [CommonModule, HouseImagesComponent, NavbarComponent, FooterComponent, AuthLayoutComponent, BookingComponent],
  imports: [CommonModule, HouseImagesComponent, NavbarComponent, FooterComponent, AmenitiesComponent],
  templateUrl: './house-details.component.html',
  styleUrls: ['./house-details.component.css']
})
export class HouseDetailsComponent {
  private route = inject(ActivatedRoute);
  private houseService = inject(HouseService);



  houseId: number = 0;
  house: any;
  isLoading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.houseId = +params['id'];
      this.loadHouseDetails();
    });
  }

  loadHouseDetails(): void {
    this.houseService.getHouseById(this.houseId).subscribe({
      next: (house) => {
        this.house = house;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load house details. Please try again later.';
        this.isLoading = false;
        console.error('Error loading house:', err);
      }
    });
  }
}


