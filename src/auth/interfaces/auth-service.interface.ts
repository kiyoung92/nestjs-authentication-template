import { Request } from 'express';
import { AuthUpdateDto } from 'src/auth/dtos/auth.dto';

export interface AuthUpdateParams {
  readonly request: Request;
  readonly dto: AuthUpdateDto;
}

export interface AuthUserPayload {
  readonly id: string;
}

export interface AuthInfo {
  readonly email: string;
  readonly username: string;
  readonly aboutMe: string | null;
  readonly profileImageUrl: string | null;
  readonly provider: string;
  readonly createdAt: Date;
  readonly updatedAt: Date | null;
  readonly deletedAt: Date | null;
}

export interface AuthJwtPayload {
  readonly id: string;
  readonly email: string;
}

export interface AuthSocialLoginInfo {
  readonly email: string;
  readonly name: string;
  readonly picture: string;
  readonly provider: string;
}
