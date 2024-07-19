import { AuthGuard } from '@nestjs/passport';

export const GithubGuard = AuthGuard('github');
export const GoogleGuard = AuthGuard('google');
