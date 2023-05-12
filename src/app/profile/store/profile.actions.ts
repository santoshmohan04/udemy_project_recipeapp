import { Action } from '@ngrx/store';

export const FETCH_PROFILE = '[Recipes] Fetch Profile';
export const SET_PROFILE = '[Recipes] Set Profile';
export const UPDATE_PROFILE = '[Recipe] Update Profile';
export const CLEAR_PROFILE_ERROR = '[Auth] Clear Profile Error';

export class SetProfile implements Action {
  readonly type = SET_PROFILE;

  constructor(
    public payload: {
      email: string;
      emailVerified: boolean;
      displayName: string;
      photoUrl: string;
      validSince: string;
      lastLoginAt: string;
      createdAt: string;
    }
  ) {}
}

export class FetchProfile implements Action {
  readonly type = FETCH_PROFILE;
  constructor(public payload: { idToken: string }) {}
}

export class UpdateProfile implements Action {
  readonly type = UPDATE_PROFILE;

  constructor(
    public payload: { idToken: string; displayName: string; photoUrl: string }
  ) {}
}

export class ClearProfileError implements Action {
  readonly type = CLEAR_PROFILE_ERROR;
}

export type ProfileActions =
  | SetProfile
  | FetchProfile
  | UpdateProfile
  | ClearProfileError;
