import type { ColumnType } from 'kysely';

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type snapshot_users = {
  snapshot_users_id: Generated<number>;
  id: string;
  email: string;
  username: string;
  password: string | null;
  about_me: string | null;
  profile_image_url: string | null;
  provider: string;
  created_at: Timestamp;
  updated_at: Timestamp | null;
  delete_yn: string | null;
};
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
  delete_yn: Generated<string | null>;
};
export type DB = {
  snapshot_users: snapshot_users;
  users: users;
};
