import {
  ValidateInvalidEmailMessage,
  ValidateMinLengthMessage,
  ValidateRequiredMessage,
  ValidateStringTypeMessage,
} from '@domain/i18n/messages';

export const UserLoginValidator = {
  email: {
    required: new ValidateRequiredMessage(),
    email: new ValidateInvalidEmailMessage(),
  },
  password: {
    required: new ValidateRequiredMessage(),
    string: new ValidateStringTypeMessage(),
    'min:8': new ValidateMinLengthMessage(8),
  },
};
