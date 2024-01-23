import { MemberEntity } from './member_entity';

export type UserEntity = {
  sub: string;
  name: string;
  email: string;
  phone_number?: string;
  status: string;
  admin: boolean;
  email_verified: boolean;
  picture?: string;
  connection_id?: string;
  created_at: Date | null | undefined;
  updated_at: Date | null | undefined;
  members?: MemberEntity[];
};
