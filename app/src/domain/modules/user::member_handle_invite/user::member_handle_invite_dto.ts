import { MemberEntity } from '@domain/entities/member_entity';

export type UserMemberHandleInviteDto = {
  match: Required<Pick<MemberEntity, 'mail_attempt_code' | 'email'>>;
  data: { action: 'accept' | 'decline' };
};
