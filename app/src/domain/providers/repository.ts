import { RepositoryUserEntity } from '@domain/entities/repository_user_entity';
import { OrganizationEntity } from '@domain/entities/organization_entity';

export interface IRepositoryProvider {
  resolve(organization: OrganizationEntity): Promise<{
    authenticated_user: () => Promise<RepositoryUserEntity | null>;
  }>;
}
