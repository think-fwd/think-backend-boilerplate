import { OrganizationEntity } from '@domain/entities/organization_entity';

export type UserOrganizationDeleteDto = {
  match: Required<Pick<OrganizationEntity, 'id'>>;
};
