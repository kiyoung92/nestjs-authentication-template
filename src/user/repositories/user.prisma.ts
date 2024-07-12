import { IEmail, IUsername } from 'src/global/dtos.global';
import { prisma } from 'src/global/prisma.global';
import { UserAllFields } from 'src/user/interfaces/user-prisma.interfcae';

export const prismaFindByEmail = async ({
  email,
}: IEmail): Promise<UserAllFields | null> => {
  return await prisma.users.findUnique({
    where: {
      email,
    },
  });
};

export const prismaFindByUsername = async ({
  username,
}: IUsername): Promise<UserAllFields | null> => {
  return await prisma.users.findUnique({
    where: {
      username,
    },
  });
};
