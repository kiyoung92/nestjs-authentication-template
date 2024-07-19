import { JwtService } from '@nestjs/jwt';
import { getEnv } from 'src/global/config.global';
import { IToken } from 'src/global/dtos.global';
import {
  JwtPayload,
  JwtVerifyToken,
} from 'src/utils/interfaces/util-jwt.interface';

const jwtService = new JwtService();

export const getAccessToken = async ({
  sub,
  email,
}: JwtPayload): Promise<string> => {
  return await jwtService.signAsync(
    {
      sub,
      email,
    },
    {
      expiresIn: getEnv<string>('JWT_ACCESS_EXPIRES_IN'),
      secret: getEnv<string>('JWT_ACCESS_SECRET'),
      algorithm: 'HS256',
    },
  );
};

export const getRefreshToken = async ({
  sub,
  email,
}: JwtPayload): Promise<string> => {
  return await jwtService.signAsync(
    {
      sub,
      email,
    },
    {
      expiresIn: getEnv<string>('JWT_REFRESH_EXPIRES_IN'),
      secret: getEnv<string>('JWT_REFRESH_SECRET'),
      algorithm: 'HS256',
    },
  );
};

export const verifyAccessToken = async ({
  token,
}: IToken): Promise<JwtVerifyToken> => {
  return await jwtService.verifyAsync(token, {
    secret: getEnv<string>('JWT_ACCESS_SECRET'),
    algorithms: ['HS256'],
  });
};

export const verifyRefreshToken = async ({
  token,
}: IToken): Promise<JwtVerifyToken> => {
  return await jwtService.verifyAsync(token, {
    secret: getEnv<string>('JWT_REFRESH_SECRET'),
    algorithms: ['HS256'],
  });
};
