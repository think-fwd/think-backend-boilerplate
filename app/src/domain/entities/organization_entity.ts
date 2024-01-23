import { ScrumEntity } from './scrum_entity';
import { MemberEntity } from './member_entity';
import { RepositoryEntity } from './repository_entity';
import { OrganizationStatusEnumKeys } from '@domain/enums/organization_status_enum';

export type OrganizationEntity = {
  id: string;
  status: OrganizationStatusEnumKeys;
  name: string;
  document: string;
  created_at: Date;
  updated_at: Date;
  members?: MemberEntity[];
  scrum?: ScrumEntity;
  repository?: RepositoryEntity;
};
