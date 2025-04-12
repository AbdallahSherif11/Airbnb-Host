import { Component } from '@angular/core';
import { NavbarComponent } from '../../../core/layout/navbar/navbar.component';
import { FilterComponent } from '../../components/filter/filter.component';
import { HouseCardComponent } from '../../components/house-card/house-card.component';
import { HouseListComponent } from "../../components/house-list/house-list.component";

@Component({
  selector: 'app-home',
  imports: [NavbarComponent, FilterComponent, HouseCardComponent, HouseListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
