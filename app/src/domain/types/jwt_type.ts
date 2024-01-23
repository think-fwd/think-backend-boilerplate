import { UserEntity } from '@domain/entities/user_entity';

export type JwtType = {
  jwt: string;
  user: Pick<
    UserEntity,
    | 'sub'
    | 'name'
    | 'email'
    | 'phone_number'
    | 'admin'
    | 'status'
    | 'picture'
    | 'connection_id'
    | 'email_verified'
    | 'members'
  >;
};
