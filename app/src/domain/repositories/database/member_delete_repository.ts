import { MemberEntity } from '@domain/entities/member_entity';

export type MemberDeleteRepositoryProps = {
  match: { organization_id: string; id: string };
};

export interface IMemberDeleteRepository {
  handle(props: MemberDeleteRepositoryProps): Promise<MemberEntity>;
}
