import { ScrumProviderEnum } from '@domain/enums/scrum_provider_enum';

export type ScrumEntity = {
  provider: ScrumProviderEnum;
  access_token: string;
  refresh_token?: string | undefined;
  access_token_exp?: number | undefined;
  id: string;
  url: string;
  name: string;
  scopes: string[];
  status: 'connected' | 'expired';
};
