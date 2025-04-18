import { afterNextRender, Component, inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HouseCardComponent } from '../house-card/house-card.component';
import { HouseService } from '../../services/house-services/house.service';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { SharedFilterService } from '../../../shared/services/shared-filter/shared-filter.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-house-list',
  standalone: true,
  imports: [CommonModule, HouseCardComponent,RouterLink],
  templateUrl: './house-list.component.html',
  styleUrls: ['./house-list.component.css']
})
export class HouseListComponent implements OnInit, OnDestroy {
  houses: any[] = [];
  isLoading = true;
  error: string | null = null;
  _PLATFORM_ID = inject(PLATFORM_ID);
  @Input() isMyHousesView = false;


  private destroy$ = new Subject<void>();

  constructor(
    private houseService: HouseService,
    private sharedFilterService: SharedFilterService
  ) {
    this.sharedFilterService.viewSelected$
      .pipe(takeUntil(this.destroy$)) // Angular 16+ or use takeUntil(this.destroy$)
      .subscribe(view => {
        this.loadHouseByView(view);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


  ngOnInit(): void {
    if(isPlatformBrowser(this._PLATFORM_ID)){
      if (this.isMyHousesView) {
        this.loadMyHouses();
      } else {
        this.loadHouses();
      }
    }
    // this.loadHouses();
    // Add price range subscription
  this.sharedFilterService.priceRangeChanged$
  .pipe(
    debounceTime(300),
    takeUntil(this.destroy$)
  )
  .subscribe(range => {
    this.loadHousesByPriceRange(range.min, range.max);
  });
}
  

  loadHouses(): void {
    this.houseService.getAllHouses().subscribe({
      next: (houses) => {
        this.houses = houses;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load houses. Please try again later.';
        this.isLoading = false;
        console.error('Error loading houses:', err);
      }
    });
  }

  loadMyHouses(): void {
    this.houseService.getMyHouses().subscribe({
      next: (houses) => {
        this.houses = houses;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load houses. Please try again later.';
        this.isLoading = false;
        console.error('Error loading houses:', err);
      }
    });
  }

  loadHouseByView(view :string):void{
    if (this.isMyHousesView) return;
    this.houseService.getHousesByView(view).subscribe({
      next: (data) => {
        this.houses = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load houses. Please try again later.';
        this.isLoading = false;
        console.error('Error loading houses:', err);
      }
    });
  }
  
  calculateRating(reviews: any[] | undefined): number {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return parseFloat((sum / reviews.length).toFixed(1));
  }

  loadHousesByPriceRange(minPrice: number, maxPrice: number): void {
    if (this.isMyHousesView) return;
    
    this.isLoading = true;
    this.error = null;
    
    this.houseService.getHousesByPriceRange(minPrice, maxPrice).subscribe({
      next: (houses) => {
        this.houses = houses;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load houses. Please try again later.';
        this.isLoading = false;
        console.error('Error loading houses:', err);
      }
    });
  }

  refresh(): void {
    if (this.isMyHousesView) {
      this.loadMyHouses();
    } else {
      this.loadHouses();
    }
  }


  
}