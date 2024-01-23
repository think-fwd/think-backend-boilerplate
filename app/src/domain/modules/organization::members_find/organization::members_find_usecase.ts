import { validate } from '@domain/utils/validate';
import { MissingPropsError } from '@domain/i18n/messages';
import { MemberEntity } from '@domain/entities/member_entity';
import { PaginationType } from '@domain/utils/pagination/types';
import { IMemberFindRepository } from '@domain/repositories/database/member_find_repository';
import { OrganizationMembersFindDto } from '@domain/modules/organization::members_find/organization::members_find_dto';
import { OrganizationMembersFindValidator } from '@domain/modules/organization::members_find/organization::members_find_validator';

export class OrganizationMembersFindUsecase {
  constructor(private readonly memberFindRepository: IMemberFindRepository) {}

  public handle = async (
    props: OrganizationMembersFindDto,
  ): Promise<PaginationType<MemberEntity> | MemberEntity[]> => {
    // throw error if usecase caller
    // does not provide any required props
    if (!props || Object.keys(props).length === 0)
      throw new MissingPropsError();

    // validate content data to prevent
    // native errors from database
    await validate(props.match, OrganizationMembersFindValidator);

    // retrieve data for provided organization id data
    const members = await this.memberFindRepository.handle({
      page: props.page,
      limit: props.limit,
      fields: props.fields,
      match: { organization_id: props.match.organization_id },
      filter: props.filter,
    });

    // return organization members
    return members;
  };
}
