import { CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class LocalAuthGuard extends AuthGuard('local') implements CanActivate {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}

export const localAuthGuard = new LocalAuthGuard();
