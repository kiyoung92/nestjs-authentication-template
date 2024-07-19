import {
  AuthInfo,
  AuthJwtPayload,
  AuthSocialLoginInfo,
  AuthUpdateParams,
  AuthUserPayload,
} from '../interfaces/auth-service.interface';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  prismaDeleteUser,
  prismaGetUser,
  prismaSocialLogin,
  prismaUpdateUser,
} from 'src/auth/repositories/auth-prisma.repository';
import { redisSetRefreshToken } from 'src/auth/repositories/auth-redis.repository';
import {
  IID,
  IRequest,
  IRequestResponse,
  IUsername,
} from 'src/global/dtos.global';
import { ResponseSuccess } from 'src/global/interfaces/response.interface';
import { redis } from 'src/global/redis.global';
import { GlobalResponse } from 'src/global/response.global';
import {
  prismaFindByEmail,
  prismaFindById,
  prismaFindByUsername,
} from 'src/user/repositories/user-prisma.repository';
import { getAccessToken, getRefreshToken } from 'src/utils/jwt.util';
import { UuidUtil } from 'src/utils/uuid.util';

@Injectable()
export class AuthService {
  async signIn({ request, response }: IRequestResponse): Promise<void> {
    if (!request.user) {
      throw new UnauthorizedException(
        '아이디 또는 비밀번호가 일치하지 않습니다.',
      );
    }

    const payload = request.user as AuthJwtPayload;

    const access_token = await getAccessToken({
      sub: payload.id,
      email: payload.email,
    });
    const refresh_token = await getRefreshToken({
      sub: payload.id,
      email: payload.email,
    });

    await redisSetRefreshToken({
      id: payload.id,
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
    response.header('Location', '/');
    response.end();
  }

  async update({
    request,
    dto,
  }: AuthUpdateParams): Promise<ResponseSuccess<AuthInfo>> {
    if (!request.user) {
      throw new UnauthorizedException('로그인이 필요한 서비스입니다.');
    }

    const payload = request.user as AuthUserPayload;
    const user = await prismaUpdateUser({
      id: payload.id,
      username: dto.username,
      password: dto.password,
      about_me: dto.aboutMe,
      profile_image_url: dto.profileImageUrl,
    });

    if (!user) {
      throw new BadRequestException();
    }

    return GlobalResponse.success<AuthInfo>({
      statusCode: HttpStatus.OK,
      message: '회원정보 수정이 완료되었습니다.',
      data: user,
    });
  }

  async delete({ request, response }: IRequestResponse): Promise<void> {
    if (!request.user) {
      throw new UnauthorizedException('로그인이 필요한 서비스입니다.');
    }

    const payload = request.user as AuthUserPayload;
    await redis.del(payload.id);
    await prismaDeleteUser({ id: payload.id });

    response.clearCookie('access_token');
    response.clearCookie('refresh_token');
    response.header('Location', '/');
    response.end();
  }

  async signOut({ request, response }: IRequestResponse): Promise<void> {
    if (!request.user) {
      throw new UnauthorizedException('로그인이 필요한 서비스입니다.');
    }

    const payload = request.user as AuthUserPayload;
    await redis.del(payload.id);

    response.clearCookie('access_token');
    response.clearCookie('refresh_token');
    response.header('Location', '/');
    response.end();
  }

  async get({ request }: IRequest): Promise<ResponseSuccess<AuthInfo>> {
    if (!request.user) {
      throw new UnauthorizedException('로그인이 필요한 서비스입니다.');
    }

    const payload = request.user as AuthUserPayload;

    const user = await prismaGetUser({ id: payload.id });

    if (!user) {
      throw new BadRequestException();
    }

    const responseData = {
      email: user.email,
      username: user.username,
      aboutMe: user.about_me,
      profileImageUrl: user.profile_image_url,
      provider: user.provider,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      deletedAt: user.deleted_at,
    };

    return GlobalResponse.success({
      statusCode: HttpStatus.OK,
      message: '회원정보를 조회하였습니다.',
      data: responseData,
    });
  }

  async socialLogin({ request, response }: IRequestResponse): Promise<void> {
    if (!request.user) {
      throw new UnauthorizedException('로그인 정보를 확인해 주세요.');
    }
    const socialLoginUserInfo = request.user as AuthSocialLoginInfo;
    const userInfo = {
      email: socialLoginUserInfo.email,
      name: socialLoginUserInfo.name,
      picture: socialLoginUserInfo.picture,
      provider: socialLoginUserInfo.provider,
    };

    let isUser = await prismaFindByEmail({ email: userInfo.email });

    if (!isUser) {
      const id = UuidUtil.v4();
      const userId = await this.checkUserId({ id });
      const username = await this.checkUserNickName({
        username: userInfo.name,
      });

      isUser = await prismaSocialLogin({
        id: userId,
        email: userInfo.email,
        username: username,
        profile_image_url: userInfo.picture,
        provider: userInfo.provider,
      });
    }

    const access_token = await getAccessToken({
      sub: isUser!.id,
      email: isUser!.email,
    });
    const refresh_token = await getRefreshToken({
      sub: isUser!.id,
      email: isUser!.email,
    });

    await redisSetRefreshToken({
      id: isUser!.id,
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
    response.header('Location', '/');
    response.end();
  }

  async checkUserId({ id }: IID): Promise<string> {
    const isUser = await prismaFindById({ id });

    if (isUser) {
      const newId = UuidUtil.v4();
      return await this.checkUserId({ id: newId });
    }

    return id;
  }

  async checkUserNickName({ username }: IUsername): Promise<string> {
    const isUser = await prismaFindByUsername({ username });

    if (isUser) {
      const newNickName = `${username.slice(
        0,
        8,
      )}_${UuidUtil.randomNumericString()}`;
      return await this.checkUserNickName({ username: newNickName });
    }

    return username;
  }
}
