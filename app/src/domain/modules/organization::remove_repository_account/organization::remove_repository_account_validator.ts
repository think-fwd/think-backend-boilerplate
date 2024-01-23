import {
  ValidateRequiredMessage,
  ValidateInvalidObjectIdMessage,
} from '@domain/i18n/messages';

export const OrganizationRemoveRepositoryAccountValidator = {
  organizationId: {
    required: new ValidateRequiredMessage(),
    objectid: new ValidateInvalidObjectIdMessage(),
  },
};
