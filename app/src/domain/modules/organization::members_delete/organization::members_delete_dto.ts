import { UserEntity } from '@domain/entities/user_entity';

export type OrganizationMembersDeleteDto = {
  user: UserEntity;
  match: { id: string; organization_id: string };
};
