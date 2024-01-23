import { MemberRoleEnum } from '@domain/enums/member_role_enum';

export type OrganizationMembersInsertDto = {
  data: {
    email: string;
    role: MemberRoleEnum;
    organization_id: string;
  };
};
