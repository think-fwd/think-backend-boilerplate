import {
  ValidateInvalidUUIDV4Message,
  ValidateMaxLengthMessage,
  ValidateMinLengthMessage,
  ValidateRequiredMessage,
  ValidateStringTypeMessage,
} from '@domain/i18n/messages';

export const UserUpdateValidator = {
  sub: {
    required: new ValidateRequiredMessage(),
    uuid: new ValidateInvalidUUIDV4Message(),
  },
  name: {
    string: new ValidateStringTypeMessage(),
    'min:2': new ValidateMinLengthMessage(2),
    'max:64': new ValidateMaxLengthMessage(64),
  },
  image: {
    string: new ValidateStringTypeMessage(),
  },
};
