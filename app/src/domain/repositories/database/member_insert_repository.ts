import { MemberEntity } from '@domain/entities/member_entity';

export type MemberInsertRepositoryProps = {
  data: Required<
    Pick<MemberEntity, 'email' | 'role' | 'status' | 'organization_id'>
  > &
    Partial<
      Pick<
        MemberEntity,
        'mail_attempt_code' | 'mail_attempt_at' | 'user_id' | 'user_name'
      >
    >;
};

export interface IMemberInsertRepository {
  handle(props: MemberInsertRepositoryProps): Promise<MemberEntity>;
}
