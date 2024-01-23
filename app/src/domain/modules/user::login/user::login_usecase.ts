import { JwtType } from '@domain/types/jwt_type';
import { validate } from '@domain/utils/validate';
import {
  MissingPropsError,
  UserInvalidPasswordError,
} from '@domain/i18n/messages';
import { UserLoginDto } from '@domain/modules/user::login/user::login_dto';
import { IAuthRepository } from '@domain/repositories/auth/auth_repository';
import { UserLoginValidator } from '@domain/modules/user::login/user::login_validator';
import { IMemberFindRepository } from '@domain/repositories/database/member_find_repository';
import { MemberEntity } from '@domain/entities/member_entity';

export class UserLoginUsecase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly membersFindRepository: IMemberFindRepository,
  ) {}

  public handle = async (props: UserLoginDto): Promise<JwtType> => {
    // throw error if usecase caller
    // does not provide any required props
    if (!props || Object.keys(props).length === 0)
      throw new MissingPropsError();

    // validate content data to prevent
    // native errors from database
    await validate(props, UserLoginValidator);

    // retrieve user from auth provider
    const authenticatedUser = await this.authRepository.userSignIn({
      email: props.email,
      password: props.password,
    });

    if (!authenticatedUser) {
      throw new UserInvalidPasswordError();
    }

    // append user members
    authenticatedUser.user.members = (await this.membersFindRepository.handle({
      match: { user_id: authenticatedUser.user.sub },
    })) as unknown as MemberEntity[];

    // return authenticated user
    return authenticatedUser;
  };
}
