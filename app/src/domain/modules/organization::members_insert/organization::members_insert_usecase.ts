import { randomUUID } from 'node:crypto';
import { validate } from '@domain/utils/validate';
import { DateUtil } from '@domain/utils/date';
import { SignatureUtil } from '@domain/utils/signature';
import { MemberEntity } from '@domain/entities/member_entity';
import { MemberStatusEnum } from '@domain/enums/member_status_enum';
import { IMemberFindRepository } from '@domain/repositories/database/member_find_repository';
import { IMemberInsertRepository } from '@domain/repositories/database/member_insert_repository';
import { OrganizationMembersInsertDto } from '@domain/modules/organization::members_insert/organization::members_insert_dto';
import { OrganizationMembersInsertValidator } from '@domain/modules/organization::members_insert/organization::members_insert_validator';

import {
  ErrorMemberAlreadyInvited,
  MissingPropsError,
} from '@domain/i18n/messages';
import { IAuthRepository } from '@domain/repositories/auth/auth_repository';

export class OrganizationMembersInsertUsecase {
  constructor(
    private readonly dateUtil: DateUtil,
    private readonly signatureUtil: SignatureUtil,
    private readonly authProvider: IAuthRepository,
    private readonly memberFindRepository: IMemberFindRepository,
    private readonly memberInsertRepository: IMemberInsertRepository,
  ) {}

  public handle = async (
    props: OrganizationMembersInsertDto,
  ): Promise<MemberEntity> => {
    // throw error if usecase caller
    // does not provide any required props
    if (!props || Object.keys(props).length === 0)
      throw new MissingPropsError();

    // validate content data to prevent
    // native errors from database
    await validate(props.data, OrganizationMembersInsertValidator);

    // check if member already exists
    const [existentMember] = (await this.memberFindRepository.handle({
      match: {
        organization_id: props.data.organization_id,
        email: props.data.email,
      },
    })) as MemberEntity[];

    // throws an error if member already exists
    if (existentMember) throw new ErrorMemberAlreadyInvited();

    // find user to be attached if exists
    const user = await this.authProvider.findByEmail(props.data.email);

    // create organization member on database
    const member: MemberEntity = await this.memberInsertRepository.handle({
      data: {
        role: props.data.role,
        email: props.data.email,
        status: MemberStatusEnum.PENDING,
        organization_id: props.data.organization_id,
        user_id: user?.sub,
        user_name: user?.name,
        mail_attempt_at: this.dateUtil.normalize().toDate(),
        mail_attempt_code: this.signatureUtil.sign(randomUUID()),
      },
    });

    // return created organization member
    return member;
  };
}
