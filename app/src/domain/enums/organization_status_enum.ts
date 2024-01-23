export enum OrganizationStatusEnum {
  SETUP = 'SETUP',
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
}

export type OrganizationStatusEnumKeys = keyof typeof OrganizationStatusEnum;
