import {
  ValidateInvalidE164Message,
  ValidateInvalidEmailMessage,
  ValidateMinLengthMessage,
  ValidateRequiredMessage,
  ValidateStringTypeMessage,
} from '@domain/i18n/messages';

export const UserRegistrationValidator = {
  name: {
    required: new ValidateRequiredMessage(),
    string: new ValidateStringTypeMessage(),
  },
  email: {
    required: new ValidateRequiredMessage(),
    email: new ValidateInvalidEmailMessage(),
  },
  phone: {
    e164: new ValidateInvalidE164Message(),
  },
  password: {
    required: new ValidateRequiredMessage(),
    string: new ValidateStringTypeMessage(),
    'min:8': new ValidateMinLengthMessage(8),
  },
};
