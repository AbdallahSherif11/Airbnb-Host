import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MessageService } from '../../services/message-services/message.service';
import { AccountService } from '../../../core/services/account/account.service';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavbarComponent } from "../../../core/layout/navbar/navbar.component";
import { FooterComponent } from "../../../core/layout/footer/footer.component";

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterOutlet],
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit {
  conversations: any[] = [];
  isLoading = true;
  error: string | null = null;
  isChatOpen = false; // Track if a chat is open

  constructor(
    private messageService: MessageService,
    private accountService: AccountService,
    private router: Router
  ) {}

  _PLATFORM_ID = inject(PLATFORM_ID);


  ngOnInit(): void {
    if(isPlatformBrowser(this._PLATFORM_ID)){
        
          this.loadConversations();
        }
    // this.loadConversations();
  }

  loadConversations(): void {
    this.messageService.getConversations().subscribe({
      next: (conversations) => {
        this.conversations = conversations.map(conversation => ({
          ...conversation,
          userImage: 'assets/default-profile.png', // Default image initially
          userName: 'Loading...' // Placeholder name initially
        }));

        // Fetch user details for each conversation
        this.conversations.forEach((conversation, index) => {
          this.messageService.getUserById(conversation.userId).subscribe({
            next: (user) => {
              this.conversations[index].userName = `${user.firstName} ${user.lastName}`;
              this.conversations[index].userImage = user.profilePictureUrl || 'assets/default-profile.png';
            },
            error: (err) => {
              console.error(`Failed to fetch user details for userId: ${conversation.userId}`, err);
            }
          });
        });

        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load conversations';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  openChat(userId: string): void {
    this.isChatOpen = true; // Mark chat as open
    this.router.navigate(['/chat', userId]);
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}