import { validate } from '@domain/utils/validate';
import { MemberEntity } from '@domain/entities/member_entity';
import { IMemberFindRepository } from '@domain/repositories/database/member_find_repository';
import { IMemberUpdateRepository } from '@domain/repositories/database/member_update_repository';
import { OrganizationMembersUpdateDto } from '@domain/modules/organization::members_update/organization::members_update_dto';
import { OrganizationMembersUpdateValidator } from '@domain/modules/organization::members_update/organization::members_update_validator';

import {
  MissingPropsError,
  ErrorMemberNotFounded,
} from '@domain/i18n/messages';

export class OrganizationMembersUpdateUsecase {
  constructor(
    private readonly memberFindRepository: IMemberFindRepository,
    private readonly memberUpdateRepository: IMemberUpdateRepository,
  ) {}

  public handle = async (
    props: OrganizationMembersUpdateDto,
  ): Promise<MemberEntity> => {
    // throw error if usecase caller
    // does not provide any required props
    if (!props || Object.keys(props).length === 0)
      throw new MissingPropsError();

    // validate content data to prevent
    // native errors from database
    await validate(
      { ...props.match, ...props.data },
      OrganizationMembersUpdateValidator,
    );

    // check if member exists
    const [member] = (await this.memberFindRepository.handle({
      match: {
        organization_id: props.match.organization_id,
        id: props.match.id,
      },
    })) as MemberEntity[];

    if (!member) throw new ErrorMemberNotFounded();

    // update organization member on database
    const updatedMember: MemberEntity =
      await this.memberUpdateRepository.handle({
        match: {
          organization_id: props.match.organization_id,
          id: props.match.id,
        },
        data: {
          role: props.data.role,
          blocked: props.data.blocked,
        },
      });

    // return update organization member
    return updatedMember;
  };
}
