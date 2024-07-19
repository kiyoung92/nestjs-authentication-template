import { Request, Response } from 'express';
import { tags } from 'typia';

// TODO: check profileImageUrl length
export interface AuthUpdateDto {
  readonly username: (string & tags.MinLength<2> & tags.MaxLength<20>) | null;
  readonly password: (string & tags.MinLength<8> & tags.MaxLength<60>) | null;
  readonly aboutMe: (string & tags.MinLength<1> & tags.MaxLength<100>) | null;
  readonly profileImageUrl:
    | (string & tags.MinLength<1> & tags.MaxLength<150>)
    | null;
}
