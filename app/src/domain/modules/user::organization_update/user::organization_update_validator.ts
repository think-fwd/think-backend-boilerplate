import {
  ValidateInvalidCnpjMessage,
  ValidateInvalidObjectIdMessage,
  ValidateMaxLengthMessage,
  ValidateMinLengthMessage,
  ValidateRequiredMessage,
  ValidateStringTypeMessage,
} from '@domain/i18n/messages';

export const UserOrganizationUpdateValidator = {
  id: {
    required: new ValidateRequiredMessage(),
    objectid: new ValidateInvalidObjectIdMessage(),
  },
  name: {
    string: new ValidateStringTypeMessage(),
    'min:2': new ValidateMinLengthMessage(2),
    'max:64': new ValidateMaxLengthMessage(64),
  },
  document: {
    string: new ValidateStringTypeMessage(),
    cnpj: new ValidateInvalidCnpjMessage(),
  },
};
