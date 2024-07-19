export interface JwtPayload {
  sub: string;
  email: string;
}

export interface JwtVerifyToken {
  sub: string;
  email: string;
  exp: number;
  iat: number;
}

export interface JwtUser {
  id: string;
  email: string;
}
