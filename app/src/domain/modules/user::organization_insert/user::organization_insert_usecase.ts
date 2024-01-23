import _ from 'lodash';
import { validate } from '@domain/utils/validate';
import { MissingPropsError } from '@domain/i18n/messages';
import { OrganizationEntity } from '@domain/entities/organization_entity';
import { UserOrganizationInsertDto } from './user::organization_insert_dto';
import { UserOrganizationInsertValidator } from './user::organization_insert_validator';
import { IOrganizationFindRepository } from '@domain/repositories/database/organization_find_repository';
import { IOrganizationInsertRepository } from '@domain/repositories/database/organization_insert_repository';
import { OrganizationStatusEnum } from '@domain/enums/organization_status_enum';

export class UserOrganizationInsertUsecase {
  constructor(
    private readonly organizationFindRepository: IOrganizationFindRepository,
    private readonly organizationInsertRepository: IOrganizationInsertRepository,
  ) {}

  public handle = async (
    props: UserOrganizationInsertDto,
  ): Promise<OrganizationEntity> => {
    // throw error if usecase caller
    // does not provide any required props
    if (!props || Object.keys(props).length === 0)
      throw new MissingPropsError();

    console.log(props.data);

    // validate content data to prevent
    // native errors from database
    await validate(props.data, UserOrganizationInsertValidator);

    // define payload to be filled by provided informations
    const payload: Partial<Pick<OrganizationEntity, 'name' | 'document'>> = {};

    // fill name if provided
    if (props.data.name) {
      _.set(payload, 'name', props.data.name);
    }

    // fill document if provided
    if (props.data.document) {
      _.set(payload, 'document', props.data.document);
    }

    // create organization on repository
    const createdOrganization = await this.organizationInsertRepository.handle({
      data: {
        ...(payload as Required<Pick<OrganizationEntity, 'name' | 'document'>>),
        user_id: props.user.sub,
        user_name: props.user.name,
        user_email: props.user.email,
        status: OrganizationStatusEnum.SETUP,
      },
    });

    // get formatted organization by repository
    const [returnOrganization] = (await this.organizationFindRepository.handle({
      match: { id: createdOrganization.id },
    })) as unknown as OrganizationEntity[];

    // return created organization
    return returnOrganization;
  };
}
