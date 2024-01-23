import { JwtType } from '@domain/types/jwt_type';
import { validate } from '@domain/utils/validate';
import { MissingPropsError } from '@domain/i18n/messages';
import { IAuthRepository } from '@domain/repositories/auth/auth_repository';
import { UserResetPasswordDto } from '@domain/modules/user::reset_password/user::reset_password_dto';
import { UserResetPasswordValidator } from '@domain/modules/user::reset_password/user::reset_password_validator';

export class UserResetPasswordUsecase {
  constructor(private readonly authRepository: IAuthRepository) {}

  public handle = async (props: UserResetPasswordDto): Promise<JwtType> => {
    // throw error if usecase caller
    // does not provide any required props
    if (!props || Object.keys(props).length === 0)
      throw new MissingPropsError();

    // validate content data to prevent
    // native errors from database
    await validate(props, UserResetPasswordValidator);

    try {
      await this.authRepository.resetPassword({
        code: props.code,
        email: props.email,
        password: props.password,
      });
    } catch (error) {
      throw new Error(error.message);
    }

    // return authenticated user
    try {
      return (await this.authRepository.userSignIn({
        email: props.email,
        password: props.password,
      })) as unknown as JwtType;
    } catch (error) {
      throw new Error(error.message);
    }
  };
}
