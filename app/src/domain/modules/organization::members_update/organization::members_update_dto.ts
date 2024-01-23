import { MemberRoleEnum } from '@domain/enums/member_role_enum';

export type OrganizationMembersUpdateDto = {
  match: { id: string; organization_id: string };
  data: {
    role: MemberRoleEnum;
    blocked: boolean;
  };
};
