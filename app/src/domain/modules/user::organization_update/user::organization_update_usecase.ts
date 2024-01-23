import _ from 'lodash';
import { validate } from '@domain/utils/validate';
import { MissingPropsError } from '@domain/i18n/messages';
import { OrganizationEntity } from '@domain/entities/organization_entity';
import { UserOrganizationUpdateDto } from './user::organization_update_dto';
import { UserOrganizationUpdateValidator } from './user::organization_update_validator';
import { IOrganizationFindRepository } from '@domain/repositories/database/organization_find_repository';
import { IOrganizationUpdateRepository } from '@domain/repositories/database/organization_update_repository';

export class UserOrganizationUpdateUsecase {
  constructor(
    private readonly organizationUpdateRepository: IOrganizationUpdateRepository,
    private readonly organizationFindRepository: IOrganizationFindRepository,
  ) {}

  public handle = async (
    props: UserOrganizationUpdateDto,
  ): Promise<OrganizationEntity> => {
    // throw error if usecase caller
    // does not provide any required props
    if (!props || Object.keys(props).length === 0)
      throw new MissingPropsError();

    // validate content data to prevent
    // native errors from database
    await validate(
      { ...props.data, ...props.match },
      UserOrganizationUpdateValidator,
    );

    // define payload to be filled by provided informations
    const payload: Partial<Pick<OrganizationEntity, 'name'>> = {};

    if (props.data.name) {
      _.set(payload, 'name', props.data.name);
    }

    if (props.data.document) {
      _.set(payload, 'document', props.data.document);
    }

    // update organization on repository
    const updatedOrganization = await this.organizationUpdateRepository.handle({
      match: props.match,
      data: payload,
    });

    // get formatted organization by repository
    const [returnOrganization] = (await this.organizationFindRepository.handle({
      match: { id: updatedOrganization.id },
    })) as unknown as OrganizationEntity[];

    // return updated organization
    return returnOrganization;
  };
}
