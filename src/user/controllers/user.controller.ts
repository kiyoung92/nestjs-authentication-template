import { TypedBody, TypedRoute } from '@nestia/core';
import { Controller, Res } from '@nestjs/common';
import {
  ResponseError,
  ResponseSuccess,
} from 'src/global/interfaces/response.interface';
import {
  UserSignUpDto,
  UserSignUpInfoDto,
} from 'src/user/interfaces/user-dtos.interface';
import { UserPasswordStrength } from 'src/user/interfaces/user-service.interface';
import { UserService } from 'src/user/providers/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @TypedRoute.Post('/checkSignUpInfo')
  async checkSignUpInfo(
    @TypedBody() dto: UserSignUpInfoDto,
  ): Promise<ResponseSuccess<null> | ResponseError<UserPasswordStrength>> {
    return await this.userService.checkSignUpInfo({
      email: dto.email,
      username: dto.username,
      password: dto.password,
    });
  }

  @TypedRoute.Post('/signUp')
  async signUp(@TypedBody() dto: UserSignUpDto) {
    return await this.userService.signUp({
      email: dto.email,
      verificationCode: dto.verificationCode,
    });
  }
}
