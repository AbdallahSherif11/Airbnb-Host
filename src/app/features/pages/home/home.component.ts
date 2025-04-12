import { Component } from '@angular/core';
import { NavbarComponent } from '../../../core/layout/navbar/navbar.component';
import { FilterComponent } from '../../components/filter/filter.component';
import { FooterComponent } from '../../../core/layout/footer/footer.component';

@Component({
  selector: 'app-home',
  imports: [NavbarComponent,FilterComponent,FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
