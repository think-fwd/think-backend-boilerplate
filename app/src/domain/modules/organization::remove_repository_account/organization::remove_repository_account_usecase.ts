import { validate } from '@domain/utils/validate';
import { MissingPropsError } from '@domain/i18n/messages';
import { OrganizationEntity } from '@domain/entities/organization_entity';
import { OrganizationRemoveRepositoryAccountDto } from './organization::remove_repository_account_dto';
import { OrganizationRemoveRepositoryAccountValidator } from './organization::remove_repository_account_validator';
import { IOrganizationRemoveRepositoryRepository } from '@domain/repositories/database/organization_remove_repository_repository';

export class OrganizationRemoveRepositoryAccountUsecase {
  constructor(
    private readonly organizationRemoveRepositoryRepository: IOrganizationRemoveRepositoryRepository,
  ) {}

  public handle = async (
    props: OrganizationRemoveRepositoryAccountDto,
  ): Promise<OrganizationEntity> => {
    // throw error if usecase caller
    // does not provide any required props
    if (!props || Object.keys(props).length === 0)
      throw new MissingPropsError();

    // validate content data to prevent
    // native errors from database
    await validate(props, OrganizationRemoveRepositoryAccountValidator);

    // update organization data with scrum account setup
    return await this.organizationRemoveRepositoryRepository.handle({
      match: { id: props.organizationId },
    });
  };
}
