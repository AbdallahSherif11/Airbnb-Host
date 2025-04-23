import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HostDetails } from '../../interfaces/host-read-DTO/HostDetails';

export interface Message {
    messageId: number;
    senderId: string;
    receiverId: string;
    messageContent: string;
    isDeleted: boolean;
    timeStamp: string;
    sender: {
      id: string;
      firstName: string;
      lastName: string;
      profilePictureUrl: string;
    };
    receiver: {
      id: string;
      firstName: string;
      lastName: string;
      profilePictureUrl: string;
    };
  }

export interface Conversation {
  userId: string;
  userName: string;
  userImage: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

interface StartConversationResponse {
  success: boolean;
  message: string;
  hostId: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private baseUrl = 'https://myairbnb.runasp.net/api/Message';

  constructor(private http: HttpClient) { }

  getConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.baseUrl}/conversations`).pipe(
      map(conversations => conversations.map(c => ({
        ...c,
        lastMessageTime: new Date(c.lastMessageTime)
      })))
    );
  }

  getConversation(otherUserId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.baseUrl}/with/${otherUserId}`);
  }

  sendMessage(receiverId: string, messageContent: string): Observable<Message> {
    return this.http.post<Message>(`${this.baseUrl}`, {
      receiverId,
      messageContent
    });
  }

  startConversation(houseId: number): Observable<StartConversationResponse> {
    return this.http.post<StartConversationResponse>(`${this.baseUrl}/start/${houseId}`, {});
  }

  getUserById(userId: string): Observable<any> {
    return this.http.get<any>(`https://myairbnb.runasp.net/api/Account/${userId}`);
  }

  getHostByHouseId(houseId: number): Observable<HostDetails> {
    return this.http.get<HostDetails>(`https://myairbnb.runasp.net/api/Account/getHost/${houseId}`);
  }
}