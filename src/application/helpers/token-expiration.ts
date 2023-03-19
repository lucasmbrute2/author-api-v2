class Token {
  private readonly SECONDS = 60
  private readonly TOKEN_EXPIRE_IN_HOURS: number

  constructor(hours: number) {
    this.TOKEN_EXPIRE_IN_HOURS = this.SECONDS * this.SECONDS * hours
  }

  get tokenExpirationHours() {
    return this.TOKEN_EXPIRE_IN_HOURS
  }
}

export class AccessTokenExpiration extends Token {
  constructor(hours = 1) {
    super(hours)
  }
}

export class RefreshTokenExpiration extends Token {
  constructor(hours = 24) {
    super(hours)
  }
}
