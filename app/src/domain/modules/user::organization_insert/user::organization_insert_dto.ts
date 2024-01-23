import { OrganizationEntity } from '@domain/entities/organization_entity';
import { UserEntity } from '@domain/entities/user_entity';

export type UserOrganizationInsertDto = {
  user: UserEntity;
  data: Pick<OrganizationEntity, 'name' | 'document'>;
};
