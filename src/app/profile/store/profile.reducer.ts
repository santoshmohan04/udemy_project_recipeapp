import { UserProfile } from '../profile.model';
import * as ProfileActions from './profile.actions';

export interface State {
  profile: UserProfile;
  resError: string;
  loading: boolean;
}

const initialState: State = {
  profile: null,
  resError: null,
  loading: false,
};

export function profileReducer(
  state: State = initialState,
  action: ProfileActions.ProfileActions
) {
  switch (action.type) {
    case ProfileActions.SET_PROFILE:
      const profile = new UserProfile(
        action.payload.email,
        action.payload.emailVerified,
        action.payload.displayName,
        action.payload.photoUrl,
        action.payload.validSince,
        action.payload.lastLoginAt,
        action.payload.createdAt
      );
      return {
        ...state,
        resError: null,
        profile: profile,
        loading: false,
      };
    case ProfileActions.CLEAR_PROFILE_ERROR:
      return {
        ...state,
        resError: null,
      };
    default:
      return state;
  }
}
