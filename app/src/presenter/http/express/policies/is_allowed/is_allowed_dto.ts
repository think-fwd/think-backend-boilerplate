import { MemberRoleEnum } from '@domain/enums/member_role_enum';
export type IsAllowedPolicyDto = {
  allowed_for_admin?: boolean;
  allowed_for_organization?: {
    id_path: string;
    roles: MemberRoleEnum[];
  };
};
