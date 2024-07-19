export interface AuthRedisSetRefreshTokenParams {
  readonly id: string;
  readonly token: string;
  readonly expiresIn: number;
}
