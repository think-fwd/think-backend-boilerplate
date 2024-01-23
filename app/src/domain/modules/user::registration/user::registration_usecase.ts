import { JwtType } from '@domain/types/jwt_type';
import { validate } from '@domain/utils/validate';
import { UserRegistrationDto } from '@domain/modules/user::registration/user::registration_dto';
import { UserRegistrationValidator } from '@domain/modules/user::registration/user::registration_validator';
import {
  MissingPropsError,
  SuccessUserRegistration,
} from '@domain/i18n/messages';
import { IAuthRepository } from '@domain/repositories/auth/auth_repository';

export class UserRegistrationUsecase {
  constructor(private readonly authRepository: IAuthRepository) {}

  public handle = async (props: UserRegistrationDto): Promise<JwtType> => {
    // throw error if usecase caller
    // does not provide any required props
    if (!props || Object.keys(props).length === 0)
      throw new MissingPropsError();

    // validate content data to prevent
    // native errors from database
    await validate(props, UserRegistrationValidator);

    try {
      // create user on auth repository
      await this.authRepository.userSignUp({
        name: props.name,
        email: props.email,
        password: props.password,
        phone_number: props.phone_number,
        'custom:admin': 'false',
        'custom:status': 'ACTIVE',
      });
    } catch (error) {
      throw new Error(error.message);
    }

    // throw success message
    throw new SuccessUserRegistration(props.email);
  };
}
