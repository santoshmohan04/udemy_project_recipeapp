import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as ProfileActions from './profile.actions';
import { environment } from 'src/environments/environment';
import { switchMap, map, throwError, catchError } from 'rxjs';
import { ProfileApiResponse, UserProfile, UsersList } from '../profile.model';

const handleProfile = (
  email: string,
  emailVerified: boolean,
  displayName: string,
  photoUrl: string,
  validSince: string,
  lastLoginAt: string,
  createdAt: string
) => {
  const profile = new UserProfile(
    email,
    emailVerified,
    displayName,
    photoUrl,
    validSince,
    lastLoginAt,
    createdAt
  );
  localStorage.setItem('profileData', JSON.stringify(profile));
  return new ProfileActions.SetProfile({
    email: email,
    emailVerified: emailVerified,
    displayName: displayName,
    photoUrl: photoUrl,
    validSince: validSince,
    lastLoginAt: lastLoginAt,
    createdAt: createdAt,
  });
};

@Injectable()
export class ProfileEffects {
  backendUrl = environment.firebaseUrl;
  idToken: string;
  profile_date: UsersList;
  userEmail: string;
  constructor(private actions$: Actions, private http: HttpClient) {}

  fetchProfile = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.FETCH_PROFILE),
      switchMap((actionData: any) => {
        return this.http.post<ProfileApiResponse>(
          this.backendUrl +
            'accounts:lookup?key=' +
            environment.angularFirebaseAPI,
          actionData.payload
        );
      }),
      map((resData) => {
        return handleProfile(
          resData.users[0].email,
          resData.users[0].emailVerified,
          resData.users[0].displayName,
          resData.users[0].photoUrl,
          resData.users[0].validSince,
          resData.users[0].lastLoginAt,
          resData.users[0].createdAt
        );
      }),
      catchError((errorRes) => {
        return this.handleError(errorRes);
      })
    )
  );

  updateProfile = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.UPDATE_PROFILE),
      switchMap((actionData: any) => {
        return this.http.post<UsersList>(
          this.backendUrl +
            'accounts:update?key=' +
            environment.angularFirebaseAPI,
          actionData.payload
        );
      }),
      map((resData) => {
        return handleProfile(
          resData.email,
          resData.emailVerified,
          resData.displayName,
          resData.photoUrl,
          resData.validSince,
          resData.lastLoginAt,
          resData.createdAt
        );
      }),
      catchError((errorRes) => {
        return this.handleError(errorRes);
      })
    )
  );

  handleError(errorRes: HttpErrorResponse) {
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
