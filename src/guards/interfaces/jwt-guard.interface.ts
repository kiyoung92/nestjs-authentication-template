import { Response } from 'express';
import { JwtVerifyToken } from 'src/utils/interfaces/util-jwt.interface';

export interface GuardJwtSetCookiesParams {
  readonly sub: string;
  readonly email: string;
  readonly response: Response;
}

export interface GuardIsUserCheckParams {
  readonly token: string;
  readonly verifyFunction: ({
    token,
  }: {
    token: string;
  }) => Promise<JwtVerifyToken>;
}

export interface GuardJwtVerifyPayload {
  readonly sub: string;
  readonly email: string;
  readonly iat: number;
  readonly exp: number;
}
