import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Subject } from 'rxjs';
import { AccountService } from '../../../core/services/account/account.service';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection | null = null;
  public messageReceived = new Subject<{senderId: string, message: string, timestamp: Date}>();
  public connectionEstablished = new BehaviorSubject<boolean>(false);
  public connectionError = new Subject<string>();

  constructor(private accountService: AccountService) {}

  public async startConnection(): Promise<void> {
    if (this.hubConnection) return;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7015/chathub', {
        accessTokenFactory: () => this.accountService.getToken() || '',
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: retryContext => {
          return Math.min(retryContext.elapsedMilliseconds * 2, 10000);
        }
      })
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    try {
      await this.hubConnection.start();
      this.setupListeners();
      this.connectionEstablished.next(true);
    } catch (error) {
      console.error('Connection failed:', error);
      this.connectionError.next('Connection failed. Please refresh.');
      throw error;
    }
  }

  private setupListeners(): void {
    if (!this.hubConnection) return;

    this.hubConnection.on('ReceiveMessage', (senderId: string, message: string, timestamp: string) => {
      const parsedTimestamp = new Date(timestamp); // Parse the timestamp
      if (isNaN(parsedTimestamp.getTime())) {
        // console.error('Invalid timestamp received:', timestamp);
        return; // Ignore invalid timestamps
      }

      this.messageReceived.next({
        senderId,
        message,
        timestamp: parsedTimestamp
      });
    });

    this.hubConnection.onreconnecting(() => {
      console.warn('SignalR reconnecting...');
      this.connectionEstablished.next(false);
    });

    this.hubConnection.onreconnected(() => {
      console.info('SignalR reconnected.');
      this.connectionEstablished.next(true);
    });

    this.hubConnection.onclose(error => {
      this.connectionEstablished.next(false);
      if (error) {
        this.connectionError.next('Connection lost. Reconnecting...');
      }
    });
  }

  public async sendMessage(senderId: string, receiverId: string, message: string): Promise<boolean> {
    if (!this.hubConnection) return false;
    
    try {
      await this.hubConnection.invoke('SendMessage', senderId, receiverId, message);
      return true;
    } catch (error) {
      console.error('Send message failed:', error);
      return false;
    }
  }

  public stopConnection(): void {
    this.hubConnection?.stop().catch(err => console.error('Stop error:', err));
    this.hubConnection = null;
  }
}