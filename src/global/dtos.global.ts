import { Request, Response } from 'express';
import { tags } from 'typia';

export interface IID {
  readonly id: string & tags.MinLength<36> & tags.MaxLength<36>;
}

export interface IEmail {
  readonly email: string & tags.Format<'email'>;
}

export interface INickName {
  readonly nick_name: string & tags.MinLength<2> & tags.MaxLength<20>;
}

export interface IPassword {
  readonly password: string & tags.MinLength<8> & tags.MaxLength<20>;
}

export interface IRequest {
  readonly request: Request;
}

export interface IResponse {
  readonly response: Response;
}

export interface IRequestResponse {
  readonly request: Request;
  readonly response: Response;
}

export interface IToken {
  readonly token: string;
}
