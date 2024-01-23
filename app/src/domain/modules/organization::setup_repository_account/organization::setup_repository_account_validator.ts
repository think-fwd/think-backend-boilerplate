import { RepositoryProviderEnum } from '@domain/enums/repository_provider_enum';
import {
  ValidateRequiredMessage,
  ValidateInvalidObjectIdMessage,
  ValidateStringTypeMessage,
  ValidateEnumInvalidOptionMessage,
} from '@domain/i18n/messages';

export const OrganizationSetupRepositoryAccountValidator = {
  organizationId: {
    required: new ValidateRequiredMessage(),
    objectid: new ValidateInvalidObjectIdMessage(),
  },
  code: {
    required: new ValidateRequiredMessage(),
    string: new ValidateStringTypeMessage(),
  },
  provider: {
    required: new ValidateRequiredMessage(),
    [`in:${Object.keys(RepositoryProviderEnum)}`]:
      new ValidateEnumInvalidOptionMessage(Object.keys(RepositoryProviderEnum)),
  },
};
