import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { catchError, map, throwError } from 'rxjs';

export interface ProfileData {
  kind: string;
  users: UsersList[];
}

export interface UsersList {
  localId: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
  providerUserInfo: ProviderUserInfo[];
  photoUrl: string;
  passwordHash: string;
  passwordUpdatedAt: number;
  validSince: string;
  disabled: boolean;
  lastLoginAt: string;
  createdAt: string;
  customAuth: boolean;
}

export interface ProviderUserInfo {
  providerId: string;
  displayName: string;
  photoUrl: string;
  federatedId: string;
  email: string;
  rawId: string;
  screenName: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserprofileService {
  backendUrl = environment.firebaseUrl;
  constructor(private http: HttpClient, private authservice: AuthService) {}

  getUserData() {
    let payload = {
      idToken: this.authservice.user.value._token,
    };
    return this.http
      .post<ProfileData>(
        this.backendUrl +
          'accounts:lookup?key=' +
          environment.angularFirebaseAPI,
        payload
      )
      .pipe(
        map((res: ProfileData) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  updateProfile(payload) {
    return this.http
      .post<ProfileData>(
        this.backendUrl +
          'accounts:update?key=' +
          environment.angularFirebaseAPI,
        payload
      )
      .pipe(
        map((res: ProfileData) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(() => errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'INVALID_ID_TOKEN':
        errorMessage = 'The credential is no longer valid. Sign in again.';
        break;
      case 'USER_NOT_FOUND':
        errorMessage =
          'There is no user record corresponding to this identifier.';
        break;
    }
    return throwError(() => errorMessage);
  }
}
