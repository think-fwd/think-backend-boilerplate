import { validate } from '@domain/utils/validate';
import {
  MissingPropsError,
  SuccessUserActivation,
} from '@domain/i18n/messages';
import { UserActivationDto } from './user::activation_dto';
import { UserActivationValidator } from './user::activation_validator';
import { IAuthRepository } from '@domain/repositories/auth/auth_repository';
import { IMemberFindRepository } from '@domain/repositories/database/member_find_repository';
import { MemberEntity } from '@domain/entities/member_entity';
import { IMemberUpdateRepository } from '@domain/repositories/database/member_update_repository';

export class UserActivationUsecase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly memberFindRepository: IMemberFindRepository,
    private readonly memberUpdateRepository: IMemberUpdateRepository,
  ) {}

  public handle = async (props: UserActivationDto): Promise<void> => {
    // throw error if usecase caller
    // does not provide any required props
    if (!props || Object.keys(props).length === 0)
      throw new MissingPropsError();

    // validate content data to prevent
    // native errors from database
    await validate(props, UserActivationValidator);

    try {
      // activate account
      await this.authRepository.userActivation(props.email, props.code);
      // find activated user
      const user = await this.authRepository.findByEmail(props.email);
      // find all members on database with provided email
      const members = (await this.memberFindRepository.handle({
        match: { email: props.email },
      })) as MemberEntity[];
      // update all memers without user
      await Promise.all(
        members
          .filter(i => !i.user_id)
          .map(member => {
            this.memberUpdateRepository.handle({
              match: { organization_id: member.organization_id, id: member.id },
              data: { user_id: user?.sub, user_name: user?.name },
            });
          }),
      );
    } catch (error) {
      throw new Error(error.message);
    }

    // return success message
    throw new SuccessUserActivation();
  };
}
