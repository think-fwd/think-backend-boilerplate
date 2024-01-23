import { validate } from '@domain/utils/validate';
import { MemberEntity } from '@domain/entities/member_entity';
import { IMemberFindRepository } from '@domain/repositories/database/member_find_repository';
import { OrganizationMembersDeleteDto } from '@domain/modules/organization::members_delete/organization::members_delete_dto';
import { OrganizationMembersDeleteValidator } from '@domain/modules/organization::members_delete/organization::members_delete_validator';

import {
  MissingPropsError,
  ErrorMemberNotFounded,
  ErrorMemberSelfDeleted,
} from '@domain/i18n/messages';
import { IMemberDeleteRepository } from '@domain/repositories/database/member_delete_repository';

export class OrganizationMembersDeleteUsecase {
  constructor(
    private readonly memberFindRepository: IMemberFindRepository,
    private readonly memberDeleteRepository: IMemberDeleteRepository,
  ) {}

  public handle = async (
    props: OrganizationMembersDeleteDto,
  ): Promise<MemberEntity> => {
    // throw error if usecase caller
    // does not provide any required props
    if (!props || Object.keys(props).length === 0)
      throw new MissingPropsError();

    // validate content data to prevent
    // native errors from database
    await validate(props.match, OrganizationMembersDeleteValidator);

    // check if member exists
    const [member] = (await this.memberFindRepository.handle({
      match: {
        organization_id: props.match.organization_id,
        id: props.match.id,
      },
    })) as MemberEntity[];

    if (!member) throw new ErrorMemberNotFounded();

    // check if members belongs to authenticated user
    if (props.user?.members?.some(m => m.id === member.id)) {
      throw new ErrorMemberSelfDeleted();
    }

    // delete organization member on database
    const deletedMember: MemberEntity =
      await this.memberDeleteRepository.handle({
        match: {
          organization_id: props.match.organization_id,
          id: props.match.id,
        },
      });

    // return deleted organization member
    return deletedMember;
  };
}
