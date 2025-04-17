import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef, effect, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SignalRService } from '../../services/SingalR-services/signalr.service';
import { MessageService } from '../../services/message-services/message.service';
import { AccountService } from '../../../core/services/account/account.service';
import { jwtDecode } from 'jwt-decode';
import { Subscription } from 'rxjs';

interface JwtPayload {
  sub: string;
  email: string;
}

interface ChatMessage {
  senderId: string;
  receiverId: string;
  content: string;
  isCurrentUser: boolean;
  messageId : number;
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  messages: ChatMessage[] = [];
  newMessage = '';
  receiverId: string = '';
  currentUserId = '';
  errorMessage = '';
  isLoading = true;
  isConnected = false;
  receiverName = 'Host';
  receiverImage: string | null = null; // Add a property to store the receiver's profile picture
  private subscriptions: Subscription[] = [];
  private isUserScrollingUp = false; // Track if the user is scrolling up

  constructor(
    private signalRService: SignalRService,
    private messageService: MessageService,
    private accountService: AccountService,
    private route: ActivatedRoute,
    public router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeUser();
    this.route.params.subscribe(params => {
      this.receiverId = params['userId'];
      if (this.currentUserId) {
        this.initializeChat();
      }
    });
  }

  ngAfterViewInit(): void {
    // Listen for scroll events to detect if the user is scrolling up
    this.scrollContainer.nativeElement.addEventListener('scroll', () => {
      const el = this.scrollContainer.nativeElement;
      const isAtBottom = el.scrollHeight - el.scrollTop === el.clientHeight;
      this.isUserScrollingUp = !isAtBottom; // If not at the bottom, user is scrolling up
    });
  }

  private scrollToBottom(force: boolean = false): void {
    setTimeout(() => {
      if (this.scrollContainer) {
        const el = this.scrollContainer.nativeElement;
        if (force || !this.isUserScrollingUp) {
          el.scrollTop = el.scrollHeight; // Scroll to the bottom only if not scrolling up or forced
        }
      }
    }, 0);
  }

  private async initializeChat(): Promise<void> {
    try {
      await this.loadMessages();
      await this.setupSignalRConnection();
      this.fetchReceiverDetails(); // Fetch receiver's profile picture
    } catch (error) {
      console.error('Chat initialization failed:', error);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
      this.scrollToBottom(); // Scroll to the bottom after loading messages
    }
  }

  private async loadMessages(): Promise<void> {
    try {
      const messages = await this.messageService.getConversation(this.receiverId).toPromise();
      if (messages) {
        this.messages = messages.map(msg => ({
          messageId: msg.messageId,
          senderId: msg.senderId,
          receiverId: msg.receiverId,
          content: msg.messageContent,
          isCurrentUser: msg.senderId === this.currentUserId,
          timestamp: new Date(msg.timeStamp)
        })).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      throw error;
    } finally {
      this.scrollToBottom(); // Scroll to the bottom after loading messages
    }
  }

  async sendMessage(): Promise<void> {
    const content = this.newMessage.trim();
    if (!content || !this.isConnected) return;

    const newMsg: ChatMessage = {
      senderId: this.currentUserId,
      receiverId: this.receiverId,
      content,
      isCurrentUser: true,
      messageId: Date.now(), // Generate a unique ID
      timestamp: new Date()
    };

    this.addMessage(newMsg); // Add the message immediately for the sender
    this.newMessage = '';

    try {
      await this.messageService.sendMessage(this.receiverId, content).toPromise();
      await this.signalRService.sendMessage(this.currentUserId, this.receiverId, content);
    } catch (error) {
      console.error('Message send failed:', error);
      this.showError('Failed to send message. Please try again.');
      this.messages = this.messages.filter(m =>
        !(m.content === content && m.isCurrentUser &&
          Math.abs(m.timestamp.getTime() - new Date().getTime()) < 1000)
      );
      this.cdr.detectChanges();
    } finally {
      this.scrollToBottom(); // Scroll to the bottom after sending a message
    }
  }

  private addMessage(message: ChatMessage): void {
    this.messages = [...this.messages, message]
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    this.cdr.detectChanges();
    this.scrollToBottom(); // Scroll to the bottom after adding a new message
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom(); // Ensure scrolling happens after view updates
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.signalRService.stopConnection();
  }

  private initializeUser(): void {
    const token = this.accountService.getToken();
    if (!token) {
      this.showError('You need to be logged in to use the chat.');
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      this.currentUserId = decoded.sub;
      if (this.receiverId) {
        this.initializeChat();
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      this.showError('Failed to authenticate. Please login again.');
    }
  }

  private async setupSignalRConnection(): Promise<void> {
    await this.signalRService.startConnection();

    this.subscriptions.push(
      this.signalRService.connectionEstablished
        .subscribe(connected => {
          this.isConnected = connected;
          this.cdr.detectChanges();
        })
    );

    this.subscriptions.push(
      this.signalRService.messageReceived.subscribe(
        ({senderId, message, timestamp}) => {
          if (senderId === this.receiverId) {
            const newMsg: ChatMessage = {
              senderId,
              receiverId: this.currentUserId,
              content: message,
              isCurrentUser: false,
              messageId: Date.now(), // Generate a unique ID for the message
              timestamp: new Date(timestamp)
            };
            
            if (!this.isDuplicateMessage(newMsg)) {
              this.addMessage(newMsg);
            }
          }
        }
      )
    );

    this.subscriptions.push(
      this.signalRService.connectionError.subscribe(error => {
        this.showError(error);
      })
    );
  }

  private isDuplicateMessage(newMessage: ChatMessage): boolean {
    return this.messages.some(existing => 
      existing.content === newMessage.content &&
      existing.senderId === newMessage.senderId &&
      existing.receiverId === newMessage.receiverId &&
      Math.abs(existing.timestamp.getTime() - newMessage.timestamp.getTime()) < 1000
    );
  }

  private showError(message: string): void {
    this.errorMessage = message;
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  retryConnection(): void {
    this.errorMessage = '';
    this.isLoading = true;
    this.initializeChat();
  }

  private fetchReceiverDetails(): void {
    this.messageService.getUserById(this.receiverId).subscribe({
      next: (user) => {
        this.receiverName = `${user.firstName} ${user.lastName}`;
        this.receiverImage = user.profilePictureUrl || null; // Use default if no profile picture
      },
      error: (err) => {
        console.error('Failed to fetch receiver details:', err);
      }
    });
  }
}
