import { IEmail, IID, IUsername } from 'src/global/dtos.global';
import { prisma } from 'src/global/prisma.global';
import {
  UserPrismaAllFields,
  UserPrismaCreateAgainUserParams,
  UserPrismaCreateUserParams,
} from 'src/user/interfaces/user-prisma.interfcae';

export const prismaFindById = async ({
  id,
}: IID): Promise<UserPrismaAllFields | null> => {
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
}: UserPrismaCreateUserParams): Promise<UserPrismaAllFields | null> => {
  return await prisma.users.create({
    data: {
      id,
      email,
      password,
      username,
    },
  });
};

export const prismaCreateAgainUser = async ({
  id,
  email,
  password,
  username,
  created_at,
  deleted_at,
}: UserPrismaCreateAgainUserParams): Promise<UserPrismaAllFields | null> => {
  return await prisma.users.update({
    where: {
      id,
    },
    data: {
      email,
      password,
      username,
      created_at,
      deleted_at,
    },
  });
};
