import {
  ValidateInvalidObjectIdMessage,
  ValidateRequiredMessage,
} from '@domain/i18n/messages';

export const UserSessionValidator = {
  user_id: {
    required: new ValidateRequiredMessage(),
    objectid: new ValidateInvalidObjectIdMessage(),
  },
};
