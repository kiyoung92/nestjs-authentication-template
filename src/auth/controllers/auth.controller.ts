import { TypedBody, TypedRoute } from '@nestia/core';
import { Controller, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthUpdateDto } from 'src/auth/dtos/auth.dto';
import { AuthInfo } from 'src/auth/interfaces/auth-service.interface';
import { AuthService } from 'src/auth/providers/auth.service';
import { ResponseSuccess } from 'src/global/interfaces/response.interface';
import { JwtGuard } from 'src/guards/jwt.guard';
import { LocalAuthGuard } from 'src/guards/local.guard';
import { GithubGuard, GoogleGuard } from 'src/guards/social.guard';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 로그인 API
   *
   * @param request - reques: Request
   * @param response - response: Response
   * @returns Promise<void>
   *
   * @tag Authorization 회원관리 API
   * @summary 로그인
   */
  @UseGuards(LocalAuthGuard)
  @TypedRoute.Post('/signIn')
  async signIn(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    await this.authService.signIn({ request, response });
  }

  @UseGuards(JwtGuard)
  @TypedRoute.Patch('/update')
  async update(
    @TypedBody() dto: AuthUpdateDto,
    @Req() request: Request,
  ): Promise<ResponseSuccess<AuthInfo>> {
    return await this.authService.update({
      request,
      dto,
    });
  }

  @UseGuards(JwtGuard)
  @TypedRoute.Delete('/delete')
  async delete(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    await this.authService.delete({ request, response });
  }

  @UseGuards(JwtGuard)
  @TypedRoute.Get('/signOut')
  async signOut(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    await this.authService.signOut({ request, response });
  }

  /**
   * 회원 정보 조회 API
   *
   * @param request - request: Request
   * @returns Promise<AuthResponseSuccess>
   *
   * @tag Authorization 회원관리 API
   * @summary 회원 정보 조회
   */
  @UseGuards(JwtGuard)
  @TypedRoute.Get('/get')
  async get(@Req() request: Request): Promise<ResponseSuccess<AuthInfo>> {
    return await this.authService.get({ request });
  }

  /**
   * Google 로그인 API
   *
   * @tag Authorization 회원관리 API
   * @summary Google 로그인
   */
  @UseGuards(GoogleGuard)
  @TypedRoute.Get('/google')
  async googleLogin() {}

  /**
   * Google 로그인 API
   *
   * @param request - request: Request
   * @param response - response: Response
   * @returns Promise<void>
   *
   * @tag Authorization 회원관리 API
   * @summary Google 로그인 callback
   */
  @UseGuards(GoogleGuard)
  @TypedRoute.Get('/google/callback')
  async googleLoginCallback(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    await this.authService.socialLogin({ request, response });
  }

  /**
   * Github 로그인 API
   *
   * @tag Authorization 회원관리 API
   * @summary Github 로그인
   */
  @UseGuards(GithubGuard)
  @TypedRoute.Get('/github')
  async githubLogin() {}

  /**
   * Github 로그인 Callback API
   *
   * @param request - request: Request
   * @param response - response: Response
   * @returns Promise<void>
   *
   * @tag Authorization 회원관리 API
   * @summary Github 로그인 callback
   */
  @UseGuards(GithubGuard)
  @TypedRoute.Get('/github/callback')
  async githubLoginCallback(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    await this.authService.socialLogin({ request, response });
  }
}
