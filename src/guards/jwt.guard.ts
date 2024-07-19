import {
  BadRequestException,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  redisGetRefreshToken,
  redisSetRefreshToken,
} from 'src/auth/repositories/auth-redis.repository';
import { IRequest } from 'src/global/dtos.global';
import {
  GuardIsUserCheckParams,
  GuardJwtSetCookiesParams,
  GuardJwtVerifyPayload,
} from 'src/guards/interfaces/jwt-guard.interface';
import { prismaFindById } from 'src/user/repositories/user-prisma.repository';
import {
  getAccessToken,
  getRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from 'src/utils/jwt.util';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const accessToken = this.extractTokenFromHeader({ request });
    const refreshToken = request.cookies['refresh_token'];

    if (!refreshToken) {
      throw new UnauthorizedException('로그인이 필요한 서비스입니다.');
    }

    if (!accessToken) {
      const setCookiesInfo = await this.isUserCheck({
        token: refreshToken,
        verifyFunction: verifyRefreshToken,
      });

      await this.responseSetCookies({
        sub: setCookiesInfo.sub,
        email: setCookiesInfo.email,
        response,
      });

      return super.canActivate(context) as boolean;
    }

    const setCookiesInfo = await this.isUserCheck({
      token: accessToken,
      verifyFunction: verifyAccessToken,
    });

    const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);
    const timeLeft = setCookiesInfo.exp - currentTimeInSeconds;

    if (timeLeft <= 60 * 60 * 24 * 3) {
      await this.responseSetCookies({
        sub: setCookiesInfo.sub,
        email: setCookiesInfo.email,
        response,
      });
    }

    return super.canActivate(context) as boolean;
  }

  private extractTokenFromHeader({ request }: IRequest): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : null;
  }

  private async responseSetCookies({
    sub,
    email,
    response,
  }: GuardJwtSetCookiesParams): Promise<void> {
    const access_token = await getAccessToken({
      sub,
      email,
    });

    const refresh_token = await getRefreshToken({
      sub,
      email,
    });

    await redisSetRefreshToken({
      id: sub,
      token: refresh_token,
      expiresIn: 60 * 60 * 24 * 30,
    });

    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    response.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    response.header('Authorization', `Bearer ${access_token}`);
    response.header('Access-Control-Expose-Headers', 'Authorization');
  }

  private async isUserCheck({
    token,
    verifyFunction,
  }: GuardIsUserCheckParams): Promise<GuardJwtVerifyPayload> {
    const userTokenInfo = await verifyFunction({ token });
    const isUser = await prismaFindById({ id: userTokenInfo.sub });

    if (!isUser) {
      throw new BadRequestException();
    }

    const isRefreshToken = await redisGetRefreshToken({
      id: userTokenInfo.sub,
    });

    if (!isRefreshToken) {
      throw new UnauthorizedException('로그인이 필요한 서비스입니다.');
    }

    return userTokenInfo;
  }
}
