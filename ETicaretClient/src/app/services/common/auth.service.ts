import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private jwtHelper: JwtHelperService, @Inject(PLATFORM_ID) private platformId: Object) { }

  identityCheck() {
    let token: string = null;
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem("accessToken");
    }

    //const decodeToken = this.jwtHelper.decodeToken(token);
    //const expirationDate: Date = this.jwtHelper.getTokenExpirationDate(token);
    let expired: boolean;
    try {
      expired = this.jwtHelper.isTokenExpired(token);
    } catch {
      expired = true;
    }


    _isAuthenticated = token != null && !expired;
  }

  get isAuthenticated(): boolean {
    return _isAuthenticated;
  }
}


export let _isAuthenticated: boolean;
