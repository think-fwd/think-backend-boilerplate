import {
  ValidateRequiredMessage,
  ValidateInvalidObjectIdMessage,
} from '@domain/i18n/messages';

export const OrganizationRemoveScrumAccountValidator = {
  organizationId: {
    required: new ValidateRequiredMessage(),
    objectid: new ValidateInvalidObjectIdMessage(),
  },
};
