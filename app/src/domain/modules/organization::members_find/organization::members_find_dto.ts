import { MemberRoleEnum } from '@domain/enums/member_role_enum';
import { MemberStatusEnum } from '@domain/enums/member_status_enum';
import { PaginationProps } from '@domain/utils/pagination/dto';

export type OrganizationMembersFindDto = PaginationProps & {
  match: {
    id?: string;
    organization_id?: string;
  };
  filter?: {
    q?: string;
    role?: MemberRoleEnum;
    status?: MemberStatusEnum;
    created_at?: string | Date;
  };
};
