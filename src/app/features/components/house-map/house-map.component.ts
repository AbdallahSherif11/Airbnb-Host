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
  private map: L.Map | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async ngAfterViewInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      try {
        await this.initMap();
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    }
  }

  private async initMap(): Promise<void> {
    // Dynamically import Leaflet
    const L = await import('leaflet');
    // await import('leaflet/dist/leaflet.css');

    // Fix marker icons - use correct paths
    const iconRetinaUrl = '/images/map-icons/marker-icon-2x.png';
    const iconUrl = '/images/map-icons/marker-icon.png';
    const shadowUrl = '/images/map-icons/marker-shadow.png';

    // Type-safe icon fix
    const iconDefault = L.Icon.Default.prototype as any;
    if (iconDefault._getIconUrl) {
      delete iconDefault._getIconUrl;
    }
    
    L.Icon.Default.mergeOptions({
      iconRetinaUrl,
      iconUrl,
      shadowUrl
    });

    // Create map
    this.map = L.map('house-map').setView([this.latitude, this.longitude], 15);

    // Add tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
      minZoom: 3
    }).addTo(this.map);

    // Add marker
    L.marker([this.latitude, this.longitude])
      .addTo(this.map)
      .bindPopup(this.title)
      .openPopup();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}