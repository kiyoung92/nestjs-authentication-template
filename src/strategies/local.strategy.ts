import { StrategyLocalUserAllFields } from './interfaces/strategy-local.interface';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { prismaFindByEmail } from 'src/user/repositories/user-prisma.repository';
import { BcryptUtil } from 'src/utils/bcrypt.util';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({ usernameField: 'email', passwordField: 'password' });
  }
  async validate(
    email: string,
    password: string,
  ): Promise<StrategyLocalUserAllFields> {
    const user = await prismaFindByEmail({ email });

    if (!user || !user.password || user.deleted_at) {
      throw new UnauthorizedException(
        '아이디 또는 비밀번호가 일치하지 않습니다.',
      );
    }

    const isPasswordValid = await BcryptUtil.compare({
      password,
      hash: user.password,
    });

    if (!isPasswordValid || user.provider !== 'local') {
      throw new UnauthorizedException(
        '아이디 또는 비밀번호가 일치하지 않습니다.',
      );
    }

    return user;
  }
}
