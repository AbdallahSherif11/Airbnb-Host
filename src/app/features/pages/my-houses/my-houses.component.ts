import { Component } from '@angular/core';
import { FooterComponent } from "../../../core/layout/footer/footer.component";
import { NavbarComponent } from "../../../core/layout/navbar/navbar.component";
import { HouseListComponent } from "../../components/house-list/house-list.component";

@Component({
  selector: 'app-my-houses',
  imports: [FooterComponent,  HouseListComponent],
  templateUrl: './my-houses.component.html',
  styleUrl: './my-houses.component.css'
})
export class MyHousesComponent {

}
