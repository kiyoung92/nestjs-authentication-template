import { IEmail, IUsername } from 'src/global/dtos.global';
import { prisma } from 'src/global/prisma.global';
import { UserSignUpInfoDto } from 'src/user/interfaces/user-dtos.interface';
import {
  CreateUserFields,
  UserAllFields,
} from 'src/user/interfaces/user-prisma.interfcae';

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

export const prismaCreateUser = async ({
  id,
  email,
  password,
  username,
}: CreateUserFields) => {
  return await prisma.users.create({
    data: {
      id,
      email,
      password,
      username,
    },
  });
};
