import { randomUUID } from 'node:crypto';
import { DateUtil } from '@domain/utils/date';
import { validate } from '@domain/utils/validate';
import { SignatureUtil } from '@domain/utils/signature';
import { MemberEntity } from '@domain/entities/member_entity';
import { IMemberFindRepository } from '@domain/repositories/database/member_find_repository';
import { IMemberUpdateRepository } from '@domain/repositories/database/member_update_repository';
import { OrganizationMembersDeleteValidator } from '@domain/modules/organization::members_delete/organization::members_delete_validator';

import {
  MissingPropsError,
  ErrorMemberNotFounded,
  ErrorMemberInviteNotPending,
} from '@domain/i18n/messages';
import { MemberStatusEnum } from '@domain/enums/member_status_enum';
import { OrganizationMembersReinviteDto } from './organization::members_reinvite_dto';

export class OrganizationMembersReinviteUsecase {
  constructor(
    private readonly dateUtil: DateUtil,
    private readonly signatureUtil: SignatureUtil,
    private readonly memberFindRepository: IMemberFindRepository,
    private readonly memberUpdateRepository: IMemberUpdateRepository,
  ) {}

  public handle = async (
    props: OrganizationMembersReinviteDto,
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

    // check if member is pending
    if (member.status !== MemberStatusEnum.PENDING) {
      throw new ErrorMemberInviteNotPending();
    }

    // update organization member on database
    const updatedMember: MemberEntity =
      await this.memberUpdateRepository.handle({
        match: {
          organization_id: props.match.organization_id,
          id: props.match.id,
        },
        data: {
          mail_attempt_at: this.dateUtil.normalize().toDate(),
          mail_attempt_code: this.signatureUtil.sign(randomUUID()),
        },
      });

    // return deleted organization member
    return updatedMember;
  };
}
