import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { IEmail, IPassword, IUsername } from 'src/global/dtos.global';
import {
  ResponseError,
  ResponseSuccess,
} from 'src/global/interfaces/response.interface';
import { redis } from 'src/global/redis.global';
import { GlobalResponse } from 'src/global/response.global';
import {
  UserCheckPasswordStrength,
  UserPasswordStrength,
  UserSendVerificationCodeInfo,
  UserSignUpInfo,
} from 'src/user/interfaces/user-service.interface';
import {
  prismaCreateUser,
  prismaFindByEmail,
  prismaFindByUsername,
} from 'src/user/repositories/user-prisma.repository';
import { BcryptUtil } from 'src/utils/bcrypt.util';
import { sendEmail } from 'src/utils/email.util';
import { UuidUtil } from 'src/utils/uuid.util';

@Injectable()
export class UserService {
  async checkEmail({ email }: IEmail): Promise<ResponseSuccess<null>> {
    const isAlreadyEmail = await prismaFindByEmail({ email });

    if (isAlreadyEmail) {
      throw new ConflictException('사용할 수 없는 이메일입니다.');
    }

    return GlobalResponse.success<null>({
      statusCode: HttpStatus.OK,
      message: '사용 가능한 이메일입니다.',
    });
  }

  async checkUserName({ username }: IUsername): Promise<ResponseSuccess<null>> {
    const isAlreadyUsername = await prismaFindByUsername({ username });

    if (isAlreadyUsername) {
      throw new ConflictException('사용할 수 없는 닉네임입니다.');
    }

    return GlobalResponse.success<null>({
      statusCode: HttpStatus.OK,
      message: '사용 가능한 닉네임입니다.',
    });
  }

  checkPassword({
    password,
  }: IPassword):
    | ResponseSuccess<UserPasswordStrength>
    | ResponseError<UserPasswordStrength> {
    const isStrongPassword = this.checkPasswordStrength({ password });

    if (isStrongPassword.strength < 3) {
      return GlobalResponse.error<UserPasswordStrength>({
        statusCode: HttpStatus.CONFLICT,
        message: isStrongPassword.message,
        data: isStrongPassword.data,
      });
    }

    return GlobalResponse.success<UserPasswordStrength>({
      statusCode: HttpStatus.OK,
      message: '사용 가능한 비밀번호입니다.',
      data: isStrongPassword.data,
    });
  }

  async sendVerificationCode({
    email,
    password,
    username,
  }: UserSendVerificationCodeInfo): Promise<ResponseSuccess<null>> {
    const verificationCode = UuidUtil.randomNumericString();

    await sendEmail({
      email,
      subject: '회원가입 인증번호',
      contents: `<h1>회원가입 인증번호: ${verificationCode}</h1>`,
    });

    const hashedPassword = await BcryptUtil.hash({ password });
    await redis.hset(email, {
      username,
      password: hashedPassword,
      verificationCode,
    });
    await redis.expire(email, 1000 * 60 * 5);

    return GlobalResponse.success({
      statusCode: HttpStatus.OK,
      message: '인증번호를 전송하였습니다.',
    });
  }

  async signUp({
    email,
    verificationCode,
  }: UserSignUpInfo): Promise<ResponseSuccess<null>> {
    // TODO: 탈퇴회원 기간 처리
    const redisVerificationCode = await redis.hget(email, 'verificationCode');

    if (!redisVerificationCode || redisVerificationCode !== verificationCode) {
      throw new ConflictException('인증번호를 확인해 주세요.');
    }

    const id = UuidUtil.v4();
    const password = await redis.hget(email, 'password');
    const username = await redis.hget(email, 'username');

    if (!password || !username) {
      throw new BadRequestException('잘못된 요청입니다.');
    }

    await prismaCreateUser({ id, email, password, username });
    await redis.hdel(email, 'username', 'password', 'verificationCode');

    return GlobalResponse.success({
      statusCode: HttpStatus.OK,
      message: '회원가입이 완료되었습니다.',
    });
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
