import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthUser } from '../../interfaces/account/auth-user';
import { LoginUser } from '../../interfaces/account/login-user';
import { clearAuthToken, getAuthToken, setAuthToken, getAuthEmail } from '../../utils/auth.utils';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  registerUser(userInfo: AuthUser): Observable<any> {
    return this.httpClient.post('https://localhost:7015/api/Account/register', userInfo).pipe(
      tap((response: any) => {
        if (response?.token) {
          setAuthToken(response.token);
        }
      })
    );
  }

  loginUser(userInfo: LoginUser): Observable<any> {
    return this.httpClient.post('https://localhost:7015/api/Account/login', userInfo).pipe(
      tap((response: any) => {
        if (response?.token) {
          setAuthToken(response.token, response.email); 
        }
      })
    );
  }

  signOut(): void {
    clearAuthToken();
    this.router.navigate(['/home']);
  }

  isLoggedIn(): boolean {
    return !!getAuthToken();
  }


  getToken(): string | null {
    return getAuthToken();
  }
}

  currentUserEmail(): string | null {
    return getAuthEmail();
  }
}

