import { MemberRoleEnum } from '@domain/enums/member_role_enum';
import { MemberStatusEnum } from '@domain/enums/member_status_enum';
import { OrganizationEntity } from './organization_entity';

export type MemberEntity = {
  id: string;
  user_id: string;
  user_name: string;
  organization_id: string;
  email: string;
  blocked: boolean;
  role: MemberRoleEnum;
  status: MemberStatusEnum;
  organization?: OrganizationEntity;
  mail_attempt_at?: Date;
  mail_attempt_code?: string;
  created_at?: string | Date;
};
