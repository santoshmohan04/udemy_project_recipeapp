export class User {
  constructor(
    public id: string,
    public email: string,
    public displayName: string,
    public _token: string,
    public registered: boolean,
    public _tokenExpirationDate: Date
  ) {}

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }
}
