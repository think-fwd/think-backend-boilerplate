export enum MemberRoleEnum {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
}

export type MemberRoleEnumKeys = keyof typeof MemberRoleEnum;
