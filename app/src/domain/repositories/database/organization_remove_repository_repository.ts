import { OrganizationEntity } from '@domain/entities/organization_entity';

export type OrganizationRemoveRepositoryRepositoryProps = {
  match: Pick<OrganizationEntity, 'id'>;
};

export interface IOrganizationRemoveRepositoryRepository {
  handle(
    props: OrganizationRemoveRepositoryRepositoryProps,
  ): Promise<OrganizationEntity>;
}
