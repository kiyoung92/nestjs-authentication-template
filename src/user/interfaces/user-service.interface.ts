export interface UserCheckPasswordStrength {
  readonly message: string;
  readonly strength: number;
  readonly data: {
    readonly passwordStrength: '강함' | '보통' | '낮음';
  };
}

export interface UserPasswordStrength {
  readonly passwordStrength: '강함' | '보통' | '낮음';
}

export interface UserSendVerificationCodeInfo {
  readonly email: string;
  readonly password: string;
  readonly username: string;
}

export interface UserSignUpInfo {
  readonly email: string;
  readonly verificationCode: string;
}
