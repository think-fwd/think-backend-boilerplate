export enum MemberStatusEnum {
  PENDING = 'PENDING',
  DECLINED = 'DECLINED',
  ACCEPTED = 'ACCEPTED',
}

export type MemberStatusEnumKeys = keyof typeof MemberStatusEnum;
