export interface StrategyLocalUserAllFields {
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
