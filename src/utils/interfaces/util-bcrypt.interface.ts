import { IPassword } from 'src/global/dtos.global';

export interface BcryptUtils {
  readonly hash: ({ password }: IPassword) => Promise<string>;
  readonly compare: ({
    password,
    hash,
  }: {
    password: string;
    hash: string;
  }) => Promise<boolean>;
}
