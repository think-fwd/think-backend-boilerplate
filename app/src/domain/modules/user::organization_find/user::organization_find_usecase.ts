import { validate } from '@domain/utils/validate';
import { MissingPropsError } from '@domain/i18n/messages';
import { PaginationType } from '@domain/utils/pagination/types';
import { UserOrganizationFindDto } from './user::organization_find_dto';
import { OrganizationEntity } from '@domain/entities/organization_entity';
import { UserOrganizationFindValidator } from './user::organization_find_validator';
import { IOrganizationFindRepository } from '@domain/repositories/database/organization_find_repository';

export class UserOrganizationFindUsecase {
  constructor(
    private readonly organizationFindRepository: IOrganizationFindRepository,
  ) {}

  public handle = async (
    props: UserOrganizationFindDto,
  ): Promise<PaginationType<OrganizationEntity> | OrganizationEntity[]> => {
    // throw error if usecase caller
    // does not provide any required props
    if (!props || Object.keys(props).length === 0)
      throw new MissingPropsError();

    // validate content data to prevent
    // native errors from database
    await validate(props.match || {}, UserOrganizationFindValidator);

    const organizations = await this.organizationFindRepository.handle({
      page: props.page,
      limit: props.limit,
      match: { user_id: props.match.user_id },
    });

    // return results
    return organizations;
  };
}
