import { ScrumProviderEnum } from '@domain/enums/scrum_provider_enum';

export type OrganizationSetupScrumAccountDto = {
  organizationId: string;
  provider: ScrumProviderEnum;
  code: string;
};
