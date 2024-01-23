import {
  ValidateRequiredMessage,
  ValidateInvalidObjectIdMessage,
} from '@domain/i18n/messages';

export const UserOrganizationDeleteValidator = {
  id: {
    required: new ValidateRequiredMessage(),
    objectid: new ValidateInvalidObjectIdMessage(),
  },
};
