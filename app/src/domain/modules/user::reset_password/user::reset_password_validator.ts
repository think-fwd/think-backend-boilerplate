import {
  ValidateInvalidEmailMessage,
  ValidateNotConfirmedMessage,
  ValidateRequiredMessage,
} from '@domain/i18n/messages';

export const UserResetPasswordValidator = {
  code: {
    required: new ValidateRequiredMessage(),
  },
  email: {
    required: new ValidateRequiredMessage(),
    email: new ValidateInvalidEmailMessage(),
  },
  password: {
    required: new ValidateRequiredMessage(),
    confirmed: new ValidateNotConfirmedMessage(),
  },
  password_confirmation: {
    required: new ValidateRequiredMessage(),
  },
};
