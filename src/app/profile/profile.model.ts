export interface UsersList {
  localId: string;
  email: string;
  kind?: string;
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

export interface ProfileApiResponse {
  kind: string;
  users: UsersList[];
}

export class UserProfile {
  constructor(
    public email: string,
    public emailVerified: boolean,
    public displayName: string,
    public photoUrl: string,
    public validSince: string,
    public lastLoginAt: string,
    public createdAt: string
  ) {}
}
