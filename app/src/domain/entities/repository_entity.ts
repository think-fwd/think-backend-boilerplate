import { RepositoryProviderEnum } from '@domain/enums/repository_provider_enum';

export type RepositoryEntity = {
  status: 'connected' | 'expired';
  provider: RepositoryProviderEnum;
  name: string;
  access_token: string;
  refresh_token?: string;
  access_token_exp?: number | undefined;
};
