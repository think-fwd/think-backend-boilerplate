import {
  ValidateRequiredMessage,
  ValidateInvalidObjectIdMessage,
} from '@domain/i18n/messages';

export const OrganizationMembersReinviteValidator = {
  id: {
    required: new ValidateRequiredMessage(),
    objectid: new ValidateInvalidObjectIdMessage(),
  },
  organization_id: {
    required: new ValidateRequiredMessage(),
    objectid: new ValidateInvalidObjectIdMessage(),
  },
};
