import { validate } from '@domain/utils/validate';
import { MissingPropsError } from '@domain/i18n/messages';
import { OrganizationSetupDoneDto } from './organization::setup_done_dto';
import { OrganizationEntity } from '@domain/entities/organization_entity';
import { OrganizationSetupDoneValidator } from './organization::setup_done_validator';
import { IOrganizationFindRepository } from '@domain/repositories/database/organization_find_repository';
import { IOrganizationUpdateRepository } from '@domain/repositories/database/organization_update_repository';

export class OrganizationSetupDoneUsecase {
  constructor(
    private readonly organizationFindRepository: IOrganizationFindRepository,
    private readonly organizationUpdateRepository: IOrganizationUpdateRepository,
  ) {}

  public handle = async (
    props: OrganizationSetupDoneDto,
  ): Promise<OrganizationEntity> => {
    // throw error if usecase caller
    // does not provide any required props
    if (!props || Object.keys(props).length === 0)
      throw new MissingPropsError();

    // validate content data to prevent
    // native errors from database
    await validate(props, OrganizationSetupDoneValidator);

    // get oprganization data
    const [organization] = (await this.organizationFindRepository.handle({
      match: { id: props.organizationId },
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

    // return if organization is already setted up
    if (organization.status === 'ACTIVE') {
      return organization;
    }

    // check if organization has been setted up scrum
    if (!organization.scrum) {
      throw new Error(
        'Você precisa concluir a configuração da sua ferramenta de scrum',
      );
    }

    // check if organization has been setted up repository
    if (!organization.repository) {
      throw new Error(
        'Você precisa concluir a configuração do seu repositório de código',
      );
    }

    // update organization data with repository account setup
    return await this.organizationUpdateRepository.handle({
      match: { id: props.organizationId },
      data: { status: 'ACTIVE' },
    });
  };
}
