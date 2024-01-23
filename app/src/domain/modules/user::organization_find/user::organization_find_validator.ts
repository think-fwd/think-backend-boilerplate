import {
  ValidateInvalidUUIDV4Message,
  ValidateRequiredMessage,
} from '@domain/i18n/messages';

export const UserOrganizationFindValidator = {
  user_id: {
    required: new ValidateRequiredMessage(),
    uuid: new ValidateInvalidUUIDV4Message(),
  },
};
