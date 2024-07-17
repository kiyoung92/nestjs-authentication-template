import * as bcrypt from 'bcrypt';
import { IPassword } from 'src/global/dtos.global';
import { BcryptUtils } from 'src/utils/interfaces/util-bcrypt.interface';

export const BcryptUtil: BcryptUtils = {
  hash: async ({ password }: IPassword): Promise<string> => {
    return await bcrypt.hash(password, 10);
  },
  compare: async ({ password, hash }): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
  },
};
