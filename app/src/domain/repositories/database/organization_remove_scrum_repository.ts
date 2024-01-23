import { OrganizationEntity } from '@domain/entities/organization_entity';

export type OrganizationRemoveScrumRepositoryProps = {
  match: Pick<OrganizationEntity, 'id'>;
};

export interface IOrganizationRemoveScrumRepository {
  handle(
    props: OrganizationRemoveScrumRepositoryProps,
  ): Promise<OrganizationEntity>;
}
