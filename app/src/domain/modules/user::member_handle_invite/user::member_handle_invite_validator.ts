import {
  ValidateRequiredMessage,
  ValidateEnumInvalidOptionMessage,
  ValidateInvalidEmailMessage,
  ValidateStringTypeMessage,
} from '@domain/i18n/messages';

export const UserMemberHandleInviteValidator = {
  email: {
    required: new ValidateRequiredMessage(),
    email: new ValidateInvalidEmailMessage(),
  },
  mail_attempt_code: {
    required: new ValidateRequiredMessage(),
    string: new ValidateStringTypeMessage(),
  },
  action: {
    required: new ValidateRequiredMessage(),
    [`in:accept,decline`]: new ValidateEnumInvalidOptionMessage([
      'accept',
      'decline',
    ]),
  },
};
