import { OrganizationEntity } from '@domain/entities/organization_entity';

export type UserOrganizationUpdateDto = {
  match: Required<Pick<OrganizationEntity, 'id'>>;
  data: Partial<Pick<OrganizationEntity, 'name' | 'document'>>;
};
