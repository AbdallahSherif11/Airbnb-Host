import { Component, Input, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as L from 'leaflet';
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

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async ngAfterViewInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      await this.loadLeaflet();
      this.initMap();
    }
  }

  private async loadLeaflet(): Promise<void> {
    const L = await import('leaflet');
    // await import('leaflet/dist/leaflet.css');
    
    // Fix for default marker icons
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'images/map-icons/marker-icon-2x.png',
      iconUrl: 'images/map-icons/marker-icon.png',
      shadowUrl: 'images/map-icons/marker-shadow.png'
    });
  }

  private initMap(): void {
    const L = (window as any).L;
    this.map = L.map('house-map').setView([this.latitude, this.longitude], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    L.marker([this.latitude, this.longitude])
      .addTo(this.map)
      .bindPopup(this.title)
      .openPopup();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}