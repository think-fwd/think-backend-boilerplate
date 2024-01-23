import { validate } from '@domain/utils/validate';
import { MissingPropsError } from '@domain/i18n/messages';
import { OrganizationEntity } from '@domain/entities/organization_entity';
import { OrganizationRemoveScrumAccountDto } from './organization::remove_scrum_account_dto';
import { OrganizationRemoveScrumAccountValidator } from './organization::remove_scrum_account_validator';
import { IOrganizationRemoveScrumRepository } from '@domain/repositories/database/organization_remove_scrum_repository';

export class OrganizationRemoveScrumAccountUsecase {
  constructor(
    private readonly organizationRemoveScrumRepository: IOrganizationRemoveScrumRepository,
  ) {}

  public handle = async (
    props: OrganizationRemoveScrumAccountDto,
  ): Promise<OrganizationEntity> => {
    // throw error if usecase caller
    // does not provide any required props
    if (!props || Object.keys(props).length === 0)
      throw new MissingPropsError();

    // validate content data to prevent
    // native errors from database
    await validate(props, OrganizationRemoveScrumAccountValidator);

    // update organization data with scrum account setup
    return await this.organizationRemoveScrumRepository.handle({
      match: { id: props.organizationId },
    });
  };
}
