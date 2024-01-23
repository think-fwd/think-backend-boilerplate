import {
  ValidateBooleanTypeMessage,
  ValidateInvalidObjectIdMessage,
  ValidateRequiredMessage,
} from '@domain/i18n/messages';

export const OrganizationMembersFindValidator = {
  organization_id: {
    required: new ValidateRequiredMessage(),
    objectid: new ValidateInvalidObjectIdMessage(),
  },
  deleteds: {
    boolean: new ValidateBooleanTypeMessage(),
  },
};
