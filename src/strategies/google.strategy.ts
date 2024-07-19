import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { getEnv } from 'src/global/config.global';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: getEnv<string>('GOOGLE_CLIENT_ID'),
      clientSecret: getEnv<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: getEnv<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (error: any, user?: any, info?: any) => void,
  ): Promise<void> {
    try {
      const { name, emails, photos, provider } = profile;
      const userName = `${name.familyName ? name.familyName : ''}${
        name.givenName ? name.givenName : ''
      }`;
      const user = {
        email: emails[0].value,
        name: userName.trim(),
        picture: photos[0].value,
        provider,
        accessToken,
        refreshToken,
      };
      done(null, user);
    } catch (err) {
      done(err);
    }
  }
}
