import { Component, Input, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-house-map',
  standalone: true,
  template: '<div id="house-map" class="w-full h-[400px] rounded-xl"></div>',
  styles: [`
    #house-map {
      z-index: 0;
    }
  `]
})
export class HouseMapComponent implements AfterViewInit, OnDestroy {
  @Input() latitude!: number;
  @Input() longitude!: number;
  @Input() title!: string;
  private map: any;
  private L: any; // Store Leaflet reference

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async ngAfterViewInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      try {
        await this.loadLeaflet();
        this.initMap();
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    }
  }

  private async loadLeaflet(): Promise<void> {
    this.L = await import('leaflet');

    // Fix for default marker icons
    const iconRetinaUrl = 'assets/images/map-icons/marker-icon-2x.png';
    const iconUrl = 'assets/images/map-icons/marker-icon.png';
    const shadowUrl = 'assets/images/map-icons/marker-shadow.png';

    // Ensure the paths are correct and accessible
    if (typeof this.L.Icon.Default !== 'undefined') {
      delete (this.L.Icon.Default.prototype as any)._getIconUrl;
      this.L.Icon.Default.mergeOptions({
        iconRetinaUrl,
        iconUrl,
        shadowUrl
      });
    } else {
      console.error('Leaflet Icon.Default is undefined');
    }
  }

  private initMap(): void {
    if (!this.L) {
      console.error('Leaflet not loaded');
      return;
    }

    try {
      this.map = this.L.map('house-map').setView([this.latitude, this.longitude], 15);

      this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      this.L.marker([this.latitude, this.longitude])
        .addTo(this.map)
        .bindPopup(this.title)
        .openPopup();
    } catch (error) {
      console.error('Map initialization error:', error);
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}