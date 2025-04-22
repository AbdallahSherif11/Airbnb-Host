import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MessageService } from '../../services/message-services/message.service';
import { Router } from '@angular/router';
import { HostDetails } from '../../interfaces/host-read-DTO/HostDetails';

@Component({
  selector: 'app-host-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './host-details.component.html',
  styleUrls: ['./host-details.component.css'],
  providers: [DatePipe]
})
export class HostDetailsComponent implements OnInit {
  @Input() houseId!: number;
  
  hostDetails: HostDetails | null = null;
  isLoading = true;
  error: string | null = null;
  currentYear = new Date().getFullYear();

  constructor(
    private messageService: MessageService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    if (this.houseId) {
      this.loadHostDetails();
    }
  }

  loadHostDetails(): void {
    this.messageService.getHostByHouseId(this.houseId).subscribe({
      next: (host) => {
        this.hostDetails = host;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load host details';
        this.isLoading = false;
        console.error('Error loading host details:', err);
      }
    });
  }

  calculateAge(dateOfBirth: string): number | null {
    if (!dateOfBirth) return null;
    const birthYear = new Date(dateOfBirth).getFullYear();
    return this.currentYear - birthYear;
  }

  formatDate(dateString: string): string {
    return this.datePipe.transform(dateString, 'MMMM yyyy') || '';
  }

  startConversation(): void {
    if (this.hostDetails?.id) {
      this.router.navigate(['/chat', this.hostDetails.id]);
    }
  }
}