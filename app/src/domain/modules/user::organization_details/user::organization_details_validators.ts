import {
  ValidateInvalidObjectIdMessage,
  ValidateRequiredMessage,
} from '@domain/i18n/messages';

export const UserOrganizationDetailsValidator = {
  organization_id: {
    required: new ValidateRequiredMessage(),
    objectid: new ValidateInvalidObjectIdMessage(),
  },
};
