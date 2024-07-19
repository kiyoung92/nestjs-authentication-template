import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { getEnv } from 'src/global/config.global';
import { StrategyJwtValidate } from 'src/strategies/interfaces/strategy-jwt.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          let token = null;
          if (request && request.cookies && request.cookies['access_token']) {
            token = request.cookies['access_token'];
          } else {
            throw new UnauthorizedException('로그인이 필요한 서비스입니다.');
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: getEnv<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: {
    sub: string;
    email: string;
    iat: number;
    exp: number;
  }): Promise<StrategyJwtValidate> {
    return { id: payload.sub, email: payload.email };
  }
}
