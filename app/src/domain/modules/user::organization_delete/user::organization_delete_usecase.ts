import { validate } from '@domain/utils/validate';
import { MissingPropsError } from '@domain/i18n/messages';
import { OrganizationEntity } from '@domain/entities/organization_entity';
import { UserOrganizationDeleteDto } from './user::organization_delete_dto';
import { UserOrganizationDeleteValidator } from './user::organization_delete_validator';
import { IOrganizationDeleteRepository } from '@domain/repositories/database/organization_delete_repository';

export class UserOrganizationDeleteUsecase {
  constructor(
    private readonly organizationDeleteRepository: IOrganizationDeleteRepository,
  ) {}

  public handle = async (
    props: UserOrganizationDeleteDto,
  ): Promise<OrganizationEntity> => {
    // throw error if usecase caller
    // does not provide any required props
    if (!props || Object.keys(props).length === 0)
      throw new MissingPropsError();

    // validate content data to prevent
    // native errors from database
    await validate(props.match, UserOrganizationDeleteValidator);

    // delete organization from database
    return await this.organizationDeleteRepository.handle({
      id: props.match.id,
    });
  };
}
