import { OrganizationEntity } from '@domain/entities/organization_entity';

export type OrganizationUpdateRepositoryProps = {
  match: Pick<OrganizationEntity, 'id'>;
  data: Partial<
    Pick<OrganizationEntity, 'name' | 'status' | 'scrum' | 'repository'>
  >;
};

export interface IOrganizationUpdateRepository {
  handle(props: OrganizationUpdateRepositoryProps): Promise<OrganizationEntity>;
}
