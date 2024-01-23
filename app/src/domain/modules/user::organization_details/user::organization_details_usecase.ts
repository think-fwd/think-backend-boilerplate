import { validate } from '@domain/utils/validate';
import { MissingPropsError } from '@domain/i18n/messages';
import { OrganizationEntity } from '@domain/entities/organization_entity';
import { IOrganizationFindRepository } from '@domain/repositories/database/organization_find_repository';
import { UserOrganizationDetailsDto } from '@domain/modules/user::organization_details/user::organization_details_dto';
import { UserOrganizationDetailsValidator } from '@domain/modules/user::organization_details/user::organization_details_validators';

export class UserOrganizationDetailsUsecase {
  constructor(
    private readonly organizationFindRepository: IOrganizationFindRepository,
  ) {}

  public handle = async (
    props: UserOrganizationDetailsDto,
  ): Promise<OrganizationEntity> => {
    // throw error if usecase caller
    // does not provide any required props
    if (!props || Object.keys(props).length === 0)
      throw new MissingPropsError();

    // validate content data to prevent
    // native errors from database
    await validate(props.match, UserOrganizationDetailsValidator);

    // retrieve data for provided user id data
    const [organization]: OrganizationEntity[] =
      (await this.organizationFindRepository.handle({
        fields: props.fields,
        match: { id: props.match.organization_id },
        allowedFields: [
          'id',
          'name',
          'document',
          'status',
          'created_at',
          'updated_at',
          'scrum.id',
          'scrum.name',
          'scrum.status',
          'scrum.provider',
          'scrum.access_token_exp',
          'repository.name',
          'repository.status',
          'repository.provider',
          'repository.access_token_exp',
        ],
      })) as OrganizationEntity[];

    // throw an error if organization not founded
    if (!organization) throw new Error('Organization not founded');

    // return organization
    return organization;
  };
}
