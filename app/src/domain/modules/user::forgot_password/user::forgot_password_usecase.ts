import { validate } from '@domain/utils/validate';
import { MissingPropsError } from '@domain/i18n/messages';
import { IAuthRepository } from '@domain/repositories/auth/auth_repository';
import { UserForgotPasswordValdiator } from './user::forgot_password_validator';
import { UserForgotPasswordDto } from '@domain/modules/user::forgot_password/user::forgot_password_dto';

export class UserForgotPasswordUsecase {
  constructor(private readonly authRepository: IAuthRepository) {}

  public handle = async (props: UserForgotPasswordDto): Promise<boolean> => {
    // throw error if usecase caller
    // does not provide any required props
    if (!props || Object.keys(props).length === 0)
      throw new MissingPropsError();

    // validate content data to prevent
    // native errors from database
    await validate(props, UserForgotPasswordValdiator);

    try {
      await this.authRepository.forgotPassword(props.email);
    } catch (error) {
      throw new Error(error.message);
    }

    // return authenticated user
    return true;
  };
}
