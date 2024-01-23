import {
  ValidateRequiredMessage,
  ValidateInvalidObjectIdMessage,
} from '@domain/i18n/messages';

export const OrganizationRepositoryStatusValidator = {
  organizationId: {
    required: new ValidateRequiredMessage(),
    objectid: new ValidateInvalidObjectIdMessage(),
  },
};
