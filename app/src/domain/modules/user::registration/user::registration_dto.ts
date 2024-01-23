import { UserEntity } from '@domain/entities/user_entity';

export type UserRegistrationDto = Pick<
  UserEntity,
  'name' | 'email' | 'phone_number'
> & {
  password: string;
};
