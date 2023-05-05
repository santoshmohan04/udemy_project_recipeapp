import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

import { User } from './user.model';

export interface AuthResponseData {
  kind: string;
  localId: string;
  email: string;
  displayName: string;
  idToken: string;
  registered?: boolean;
  refreshToken: string;
  expiresIn: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;
  backendUrl = environment.firebaseUrl;

  constructor(private http: HttpClient, private router: Router) {}

  get UserDetails() {
    const userDetails = JSON.parse(localStorage.getItem('userData'));
    if (userDetails) {
      this.user.next(userDetails);
      return userDetails;
    }
  }

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        this.backendUrl +
          'accounts:signUp?key=' +
          environment.angularFirebaseAPI,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.localId,
            resData.email,
            resData.displayName,
            resData.idToken,
            resData.registered,
            +resData.expiresIn
          );
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        this.backendUrl +
          'accounts:signInWithPassword?key=' +
          environment.angularFirebaseAPI,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.localId,
            resData.email,
            resData.displayName,
            resData.idToken,
            resData.registered,
            +resData.expiresIn
          );
        })
      );
  }

  autoLogin() {
    const userData: {
      id: string;
      email: string;
      displayName: string;
      _token: string;
      registered: boolean;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.id,
      userData.email,
      userData.displayName,
      userData._token,
      userData.registered,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(
    userId: string,
    email: string,
    displayName: string,
    token: string,
    registered: boolean,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(
      userId,
      email,
      displayName,
      token,
      registered,
      expirationDate
    );
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(() => errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
    }
    return throwError(() => errorMessage);
  }
}
