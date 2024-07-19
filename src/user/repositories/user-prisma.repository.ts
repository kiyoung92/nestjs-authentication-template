import { IEmail, IID, IUsername } from 'src/global/dtos.global';
import { prisma } from 'src/global/prisma.global';
import {
  UserPrismaAllFields,
  UserPrismaCreateUserParams,
} from 'src/user/interfaces/user-prisma.interfcae';

export const prismaFindById = async ({ id }: IID) => {
  return await prisma.users.findUnique({
    where: {
      id,
    },
  });
};
export const prismaFindByEmail = async ({
  email,
}: IEmail): Promise<UserPrismaAllFields | null> => {
  return await prisma.users.findUnique({
    where: {
      email,
    },
  });
};

export const prismaFindByUsername = async ({
  username,
}: IUsername): Promise<UserPrismaAllFields | null> => {
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
}: UserPrismaCreateUserParams) => {
  return await prisma.users.create({
    data: {
      id,
      email,
      password,
      username,
    },
  });
};
