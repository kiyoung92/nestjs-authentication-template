import type { ColumnType } from 'kysely';

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type users = {
  id: string;
  email: string;
  username: string;
  password: string | null;
  about_me: string | null;
  profile_image_url: string | null;
  provider: Generated<string>;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
  deleted_at: Timestamp | null;
};
export type DB = {
  users: users;
};
