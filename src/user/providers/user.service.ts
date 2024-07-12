import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { IPassword } from 'src/global/dtos.global';
import {
  ResponseError,
  ResponseSuccess,
} from 'src/global/interfaces/response.interface';
import { GlobalResponse } from 'src/global/response.global';
import {
  UserSignUpDto,
  UserSignUpInfoDto,
} from 'src/user/interfaces/user-dtos.interface';
import {
  UserCheckPasswordStrength,
  UserPasswordStrength,
} from 'src/user/interfaces/user-service.interface';
import {
  prismaFindByEmail,
  prismaFindByUsername,
} from 'src/user/repositories/user.prisma';

@Injectable()
export class UserService {
  async checkSignUpInfo({
    email,
    password,
    username,
  }: UserSignUpInfoDto): Promise<
    ResponseSuccess<null> | ResponseError<UserPasswordStrength>
  > {
    const isAlreadyEmail = await prismaFindByEmail({ email });

    if (isAlreadyEmail) {
      throw new ConflictException('사용할 수 없는 이메일입니다.');
    }

    const isAlreadyUsername = await prismaFindByUsername({ username });

    if (isAlreadyUsername) {
      throw new ConflictException('사용할 수 없는 닉네임입니다.');
    }

    const isStrongPassword = this.checkPasswordStrength({ password });

    if (isStrongPassword.strength < 3) {
      return GlobalResponse.error<UserPasswordStrength>({
        statusCode: HttpStatus.CONFLICT,
        message: isStrongPassword.message,
        data: isStrongPassword.data,
      });
    }

    // TODO: send verification code to email
    // TODO: redis hset key: email, value: { username, password, verificationCode }

    return GlobalResponse.success<null>({
      statusCode: HttpStatus.OK,
      message: '인증번호를 전송하였습니다.',
    });
  }

  async signUp({ email, verificationCode }: UserSignUpDto) {
    // TODO: compare verification code
    // TODO: redis hget key: email & redis hdel key: email
    // TODO: prisma create user
  }

  checkPasswordStrength({ password }: IPassword): UserCheckPasswordStrength {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/\W/.test(password)) strength++;
    if (/(\w)\1/.test(password)) strength--;

    switch (strength) {
      case 4:
        return {
          message: '사용 가능한 비밀번호입니다.',
          strength,
          data: { passwordStrength: '강함' },
        };
      case 3:
        return {
          message: '사용 가능한 비밀번호입니다.',
          strength,
          data: { passwordStrength: '보통' },
        };
      case 2:
      case 1:
      default:
        return {
          message: '사용할 수 없는 비밀번호입니다.',
          strength,
          data: { passwordStrength: '낮음' },
        };
    }
  }
}
