import { TypedBody, TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';
import { IEmail, IPassword, IUsername } from 'src/global/dtos.global';
import {
  ResponseError,
  ResponseSuccess,
} from 'src/global/interfaces/response.interface';
import {
  UserSendVerificationCodeDto,
  UserSignUpDto,
} from 'src/user/dtos/user.dto';
import { UserPasswordStrength } from 'src/user/interfaces/user-service.interface';
import { UserService } from 'src/user/providers/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @TypedRoute.Post('/checkEmail')
  async checkEmail(@TypedBody() dto: IEmail): Promise<ResponseSuccess<null>> {
    return await this.userService.checkEmail({ email: dto.email });
  }

  @TypedRoute.Post('/checkUserName')
  async checkUserName(
    @TypedBody() dto: IUsername,
  ): Promise<ResponseSuccess<null>> {
    return await this.userService.checkUserName({ username: dto.username });
  }

  @TypedRoute.Post('/checkPassword')
  checkPassword(
    @TypedBody() dto: IPassword,
  ):
    | ResponseSuccess<UserPasswordStrength>
    | ResponseError<UserPasswordStrength> {
    return this.userService.checkPassword({ password: dto.password });
  }

  @TypedRoute.Post('/sendVerificationCode')
  async sendVerificationCode(
    @TypedBody() dto: UserSendVerificationCodeDto,
  ): Promise<ResponseSuccess<null>> {
    return await this.userService.sendVerificationCode({
      email: dto.email,
      username: dto.username,
      password: dto.password,
    });
  }

  @TypedRoute.Post('/signUp')
  async signUp(
    @TypedBody() dto: UserSignUpDto,
  ): Promise<ResponseSuccess<null>> {
    return await this.userService.signUp({
      email: dto.email,
      verificationCode: dto.verificationCode,
    });
  }
}
