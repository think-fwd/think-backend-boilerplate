import { OrganizationEntity } from '@domain/entities/organization_entity';

export type OrganizationDeleteRepositoryProps = {
  id: string;
};

export interface IOrganizationDeleteRepository {
  handle(props: OrganizationDeleteRepositoryProps): Promise<OrganizationEntity>;
}
