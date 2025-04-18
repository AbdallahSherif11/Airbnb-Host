import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { AuthUser } from '../../interfaces/account/auth-user';
import { LoginUser } from '../../interfaces/account/login-user';
import { clearAuthToken, getAuthToken, setAuthToken, getAuthEmail } from '../../utils/auth.utils';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(!!getAuthToken()); // Initialize with current login state
  isLoggedIn$ = this.isLoggedInSubject.asObservable(); // Expose as observable

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  registerUser(userInfo: AuthUser): Observable<any> {
    return this.httpClient.post('https://localhost:7015/api/Account/register', userInfo).pipe(
      tap((response: any) => {
        if (response?.token) {
          setAuthToken(response.token);
          this.isLoggedInSubject.next(true); // Notify subscribers
        }
      })
    );
  }

  loginUser(userInfo: LoginUser): Observable<any> {
    return this.httpClient.post('https://localhost:7015/api/Account/login', userInfo).pipe(
      tap((response: any) => {
        if (response?.token) {
          setAuthToken(response.token, response.email);
          this.isLoggedInSubject.next(true); // Notify subscribers
        }
      })
    );
  }

  signOut(): void {
    clearAuthToken();
    this.isLoggedInSubject.next(false); // Notify subscribers
    this.router.navigate(['/home']);
  }

  isLoggedIn(): boolean {
    return !!getAuthToken();
  }

  getToken(): string | null {
    return getAuthToken();
  }

  currentUserEmail(): string | null {
    return getAuthEmail();
  }


  getUserId(): string | null {
    const token = getAuthToken();
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      return decoded?.sub || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}



