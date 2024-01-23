import {
  ValidateInvalidCnpjMessage,
  ValidateMaxLengthMessage,
  ValidateMinLengthMessage,
  ValidateRequiredMessage,
  ValidateStringTypeMessage,
} from '@domain/i18n/messages';

export const UserOrganizationInsertValidator = {
  name: {
    required: new ValidateRequiredMessage(),
    string: new ValidateStringTypeMessage(),
    'min:2': new ValidateMinLengthMessage(2),
    'max:64': new ValidateMaxLengthMessage(64),
  },
  document: {
    required: new ValidateRequiredMessage(),
    string: new ValidateStringTypeMessage(),
    cnpj: new ValidateInvalidCnpjMessage(),
  },
};
