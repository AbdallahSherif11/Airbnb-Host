import { HttpClient } from '@angular/common/http';
import { Injectable,inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthUser } from '../../interfaces/account/auth-user';
import { LoginUser } from '../../interfaces/account/login-user';


@Injectable({
  providedIn: 'root'
})
export class AccountService {

    _httpClient = inject(HttpClient)
    constructor() { }
    registerUser(userInfo:AuthUser):Observable<any>{
      return this._httpClient.post('https://localhost:7015/api/Account/register',userInfo)
    }
    
    loginUser(userInfo:LoginUser):Observable<any>{
      return this._httpClient.post('https://localhost:7015/api/Account/login',userInfo)
    }
    
    
  }
