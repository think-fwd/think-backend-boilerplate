import {
  ValidateInvalidEmailMessage,
  ValidateRequiredMessage,
  ValidateStringTypeMessage,
} from '@domain/i18n/messages';

export const UserActivationValidator = {
  code: {
    required: new ValidateRequiredMessage(),
    string: new ValidateStringTypeMessage(),
  },
  email: {
    required: new ValidateRequiredMessage(),
    email: new ValidateInvalidEmailMessage(),
  },
};
