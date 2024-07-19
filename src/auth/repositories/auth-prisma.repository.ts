import { IID } from '../../global/dtos.global';
import { InternalServerErrorException } from '@nestjs/common';
import {
  AuthPrismaAllFields,
  AuthPrismaSocialLogin,
  AuthPrismaUpdateInfo,
  AuthPrismaUpdateParams,
  AuthPrismaUpdateResult,
} from 'src/auth/interfaces/auth-prisma.interface';
import { prisma } from 'src/global/prisma.global';
import { BcryptUtil } from 'src/utils/bcrypt.util';

export const prismaUpdateUser = async ({
  id,
  username,
  password,
  about_me,
  profile_image_url,
}: AuthPrismaUpdateParams): Promise<AuthPrismaUpdateResult> => {
  try {
    const params = {} as AuthPrismaUpdateInfo;
    if (username) params['username'] = username;
    if (password) params['password'] = await BcryptUtil.hash({ password });
    if (about_me) params['about_me'] = about_me;
    if (profile_image_url) params['profile_image_url'] = profile_image_url;

    const user = await prisma.users.update({
      where: {
        id,
      },
      data: {
        ...params,
      },
    });
    return {
      email: user.email,
      username: user.username,
      aboutMe: user.about_me,
      profileImageUrl: user.profile_image_url,
      provider: user.provider,
      updatedAt: user.updated_at,
      createdAt: user.created_at,
      deletedAt: user.deleted_at,
    };
  } catch (error) {
    throw new InternalServerErrorException();
  }
};

export const prismaDeleteUser = async ({ id }: IID): Promise<void> => {
  await prisma.users.update({
    where: {
      id,
    },
    data: {
      deleted_at: new Date().toISOString(),
    },
  });
};

export const prismaSocialLogin = async ({
  id,
  email,
  username,
  profile_image_url,
  provider,
}: AuthPrismaSocialLogin): Promise<AuthPrismaAllFields> => {
  return await prisma.users.create({
    data: {
      id,
      email,
      username,
      profile_image_url,
      provider,
    },
  });
};

export const prismaGetUser = async ({
  id,
}: IID): Promise<AuthPrismaAllFields | null> => {
  try {
    return await prisma.users.findFirst({
      where: {
        id,
      },
    });
  } catch (error) {
    throw new InternalServerErrorException();
  }
};
