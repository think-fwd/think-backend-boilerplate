import { MemberEntity } from '@domain/entities/member_entity';

export type MemberUpdateRepositoryProps = {
  match: { organization_id: string; id: string };
  data: Partial<
    Pick<
      MemberEntity,
      | 'user_id'
      | 'user_name'
      | 'blocked'
      | 'role'
      | 'status'
      | 'mail_attempt_at'
      | 'mail_attempt_code'
    >
  >;
};

export interface IMemberUpdateRepository {
  handle(props: MemberUpdateRepositoryProps): Promise<MemberEntity>;
}
