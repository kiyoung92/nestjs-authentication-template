export interface UserPrismaAllFields {
  readonly id: string;
  readonly email: string;
  readonly username: string;
  readonly password: string | null;
  readonly about_me: string | null;
  readonly profile_image_url: string | null;
  readonly provider: string;
  readonly created_at: Date;
  readonly updated_at: Date | null;
  readonly deleted_at: Date | null;
}

export interface UserPrismaCreateUserParams {
  readonly id: string;
  readonly email: string;
  readonly password: string;
  readonly username: string;
}

export interface UserPrismaCreateAgainUserParams {
  readonly id: string;
  readonly email: string;
  readonly password: string;
  readonly username: string;
  readonly created_at: Date;
  readonly deleted_at: Date | null;
}
