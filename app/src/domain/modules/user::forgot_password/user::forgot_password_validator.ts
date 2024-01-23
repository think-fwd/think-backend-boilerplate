import {
  ValidateInvalidEmailMessage,
  ValidateRequiredMessage,
} from '@domain/i18n/messages';

export const UserForgotPasswordValdiator = {
  email: {
    required: new ValidateRequiredMessage(),
    email: new ValidateInvalidEmailMessage(),
  },
};
