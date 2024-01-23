/* eslint-disable @typescript-eslint/no-namespace */
import { UserEntity } from '@domain/entities/user_entity';
import { AuthType } from '@domain/types/auth_type';
export {};
declare global {
  namespace Express {
    export interface Request {
      jwt: string;
      auth: AuthType;
      user: UserEntity;
    }
  }
}
