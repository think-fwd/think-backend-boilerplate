import {
  MissingPropsError,
  ErrorMemberNotFounded,
  ErrorMemberInviteNotPending,
} from '@domain/i18n/messages';
import { validate } from '@domain/utils/validate';
import { MemberEntity } from '@domain/entities/member_entity';
import { MemberStatusEnum } from '@domain/enums/member_status_enum';
import { IMemberFindRepository } from '@domain/repositories/database/member_find_repository';
import { IMemberUpdateRepository } from '@domain/repositories/database/member_update_repository';
import { UserMemberHandleInviteDto } from '@domain/modules/user::member_handle_invite/user::member_handle_invite_dto';
import { UserMemberHandleInviteValidator } from '@domain/modules/user::member_handle_invite/user::member_handle_invite_validator';

export class UserMemberHandleInviteUsecase {
  constructor(
    private readonly memberFindRepository: IMemberFindRepository,
    private readonly memberUpdateRepository: IMemberUpdateRepository,
  ) {}

  public handle = async (
    props: UserMemberHandleInviteDto,
  ): Promise<MemberEntity> => {
    // throw error if usecase caller
    // does not provide any required props
    if (!props || Object.keys(props).length === 0)
      throw new MissingPropsError();

    // validate content data to prevent
    // native errors from database
    await validate(
      { ...props.match, ...props.data },
      UserMemberHandleInviteValidator,
    );

    // retrieve user members
    const [invite] = (await this.memberFindRepository.handle({
      match: {
        mail_attempt_code: props.match.mail_attempt_code,
        email: props.match.email,
      },
    })) as Array<MemberEntity>;

    // throws error if invite not founded
    if (!invite) {
      throw new ErrorMemberNotFounded();
    }

    if (invite.status !== MemberStatusEnum.PENDING) {
      throw new ErrorMemberInviteNotPending();
    }

    // mount status for provided action
    const status = {
      accept: MemberStatusEnum.ACCEPTED,
      decline: MemberStatusEnum.DECLINED,
    };

    // update user member to accept/decline status
    const member = await this.memberUpdateRepository.handle({
      match: {
        id: String(invite.id),
        organization_id: String(invite.organization_id),
      },
      data: {
        status: status[props.data.action],
      },
    });

    // return updated member
    return member;
  };
}
