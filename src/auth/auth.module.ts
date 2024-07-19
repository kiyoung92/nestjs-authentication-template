import { Module } from '@nestjs/common';
import { AuthController } from 'src/auth/controllers/auth.controller';
import { AuthService } from 'src/auth/providers/auth.service';
import { GoogleStrategy } from 'src/strategies/google.strategy';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { LocalStrategy } from 'src/strategies/local.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, GoogleStrategy, JwtStrategy],
})
export class AuthModule {}
