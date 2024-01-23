import { RepositoryProviderEnum } from '@domain/enums/repository_provider_enum';

export type OrganizationSetupRepositoryAccountDto = {
  organizationId: string;
  provider: RepositoryProviderEnum;
  code: string;
};
