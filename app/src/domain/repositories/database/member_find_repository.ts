import { MemberEntity } from '@domain/entities/member_entity';
import { PaginationProps } from '@domain/utils/pagination/dto';
import { PaginationType } from '@domain/utils/pagination/types';

export type MemberFindRepositoryProps = PaginationProps & {
  match?: Partial<
    Pick<
      MemberEntity,
      'mail_attempt_code' | 'email' | 'id' | 'user_id' | 'organization_id'
    >
  >;
  filter?: {
    q?: string;
  } & Partial<Pick<MemberEntity, 'role' | 'status' | 'created_at'>>;
};

export interface IMemberFindRepository {
  handle(
    props: MemberFindRepositoryProps,
  ): Promise<PaginationType<MemberEntity> | MemberEntity[]>;
}
