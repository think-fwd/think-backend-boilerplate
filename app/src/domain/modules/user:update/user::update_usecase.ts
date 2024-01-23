import _ from 'lodash';
import { validate } from '@domain/utils/validate';
import { UserUpdateDto } from './user::update_dto';
import { UserEntity } from '@domain/entities/user_entity';
import { MissingPropsError } from '@domain/i18n/messages';
import { UserUpdateValidator } from './user::update_validator';
import { IAuthRepository } from '@domain/repositories/auth/auth_repository';
import { SystemUploadFileUsecase } from '../system::upload_file/system::upload_file_usecase';
import { IMemberFindRepository } from '@domain/repositories/database/member_find_repository';
import { MemberEntity } from '@domain/entities/member_entity';

export class UserUpdateUsecase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly systemUploadFileUsecase: SystemUploadFileUsecase,
    private readonly membersFindRepository: IMemberFindRepository,
  ) {}

  public handle = async (props: UserUpdateDto): Promise<UserEntity> => {
    // throw error if usecase caller
    // does not provide any required props
    if (!props || Object.keys(props).length === 0)
      throw new MissingPropsError();

    // validate content data to prevent
    // native errors from database
    await validate(props, UserUpdateValidator);

    // define payload to be filled by provided informations
    const payload: Partial<Pick<UserEntity, 'name' | 'picture'>> = {};

    // fill name if provided
    if (props.name) _.set(payload, 'name', props.name);

    // check if file was uploaded if props.file exists
    if (props.picture) {
      const uploadedFile = await this.systemUploadFileUsecase.handle({
        image: props.picture,
        moveFileAcl: 'public-read',
        moveFileTo: `profiles/${props.sub}`,
      });
      // update payload with url if moved currectly
      if (uploadedFile) _.set(payload, 'picture', uploadedFile);
    }

    // create note on repository
    const updatedUser = await this.authRepository.updateUser(
      props.token,
      payload,
    );

    // append user members
    updatedUser.members = (await this.membersFindRepository.handle({
      match: { user_id: updatedUser.sub },
    })) as unknown as MemberEntity[];

    // return created note
    return updatedUser;
  };
}
