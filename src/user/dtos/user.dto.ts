import { tags } from 'typia';

export interface UserSendVerificationCodeDto {
  readonly email: string & tags.Format<'email'>;
  readonly password: string & tags.MinLength<6> & tags.MaxLength<20>;
  readonly username: string & tags.MinLength<2> & tags.MaxLength<10>;
}

export interface UserSignUpDto {
  readonly email: string & tags.Format<'email'>;
  readonly verificationCode: string & tags.MinLength<6> & tags.MaxLength<6>;
}
