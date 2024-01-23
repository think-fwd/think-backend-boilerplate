import { JwtType } from '@domain/types/jwt_type';
import { UserEntity } from '@domain/entities/user_entity';

export type AuthCredentialsDto = {
  email: string;
  password: string;
};

export type AuthResetPasswordDto = AuthCredentialsDto & {
  code: string;
};

export type CreateUserDto = AuthCredentialsDto & {
  name: string;
  phone_number?: string;
  'custom:admin': string;
  'custom:status': string;
};

export interface IAuthRepository {
  generatePem: () => Promise<Record<string, string>>;
  session: (token: string) => Promise<UserEntity>;
  userSignUp: (payload: CreateUserDto) => Promise<string>;
  userSignIn: (payload: AuthCredentialsDto) => Promise<JwtType | null>;
  userActivation: (email: string, code: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (payload: AuthResetPasswordDto) => Promise<boolean>;
  findByEmail(email: string): Promise<UserEntity | undefined>;
  updateUser: (
    token: string,
    attributes: Partial<UserEntity>,
  ) => Promise<UserEntity>;
}
