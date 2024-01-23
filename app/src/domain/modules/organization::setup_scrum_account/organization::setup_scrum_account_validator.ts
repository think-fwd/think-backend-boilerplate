import { ScrumProviderEnum } from '@domain/enums/scrum_provider_enum';
import {
  ValidateRequiredMessage,
  ValidateInvalidObjectIdMessage,
  ValidateStringTypeMessage,
  ValidateEnumInvalidOptionMessage,
} from '@domain/i18n/messages';

export const OrganizationSetupScrumAccountValidator = {
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
    [`in:${Object.keys(ScrumProviderEnum)}`]:
      new ValidateEnumInvalidOptionMessage(Object.keys(ScrumProviderEnum)),
  },
};
