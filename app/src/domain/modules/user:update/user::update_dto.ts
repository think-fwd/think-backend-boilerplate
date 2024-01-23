import { UserEntity } from '@domain/entities/user_entity';

export type UserUpdateDto = Pick<UserEntity, 'sub' | 'name' | 'picture'> & {
  token: string;
};
