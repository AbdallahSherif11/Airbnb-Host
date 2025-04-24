import { Component } from '@angular/core';
import { FilterComponent } from '../../components/filter/filter.component';
import { HouseListComponent } from "../../components/house-list/house-list.component";
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  imports: [ FilterComponent, HouseListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
    constructor(
        private titleService: Title,
      ) {}
    
      ngOnInit(): void {
        this.titleService.setTitle("Stayin'");
      }
}
