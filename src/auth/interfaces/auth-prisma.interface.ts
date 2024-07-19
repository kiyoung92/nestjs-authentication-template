import { tags } from 'typia';

export interface AuthPrismaUpdateParams {
  readonly id: string;
  readonly username: string | null;
  readonly password: string | null;
  readonly about_me: string | null;
  readonly profile_image_url: string | null;
}

export interface AuthPrismaUpdateResult {
  readonly email: string;
  readonly username: string;
  readonly aboutMe: string | null;
  readonly profileImageUrl: string | null;
  readonly provider: string;
  readonly createdAt: Date;
  readonly updatedAt: Date | null;
  readonly deletedAt: Date | null;
}

export interface AuthPrismaUpdateInfo {
  username: string;
  password: string | null;
  about_me: string | null;
  profile_image_url: string | null;
}

export interface AuthPrismaSocialLogin {
  readonly id: string & tags.MinLength<36> & tags.MaxLength<36>;
  readonly email: string & tags.Format<'email'>;
  username: string & tags.MinLength<2> & tags.MaxLength<20>;
  readonly profile_image_url:
    | (string & tags.MinLength<1> & tags.MaxLength<150>)
    | null;
  readonly provider: string;
}

export interface AuthPrismaAllFields {
  id: string;
  email: string;
  username: string;
  password: string | null;
  about_me: string | null;
  profile_image_url: string | null;
  provider: string;
  created_at: Date;
  updated_at: Date | null;
  deleted_at: Date | null;
}
