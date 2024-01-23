import { MemberRoleEnum } from '@domain/enums/member_role_enum';

import {
  ValidateArrayTypeMessage,
  ValidateBooleanTypeMessage,
  ValidateEnumInvalidOptionMessage,
  ValidateInvalidObjectIdMessage,
  ValidateInvalidUUIDV4Message,
  ValidateObjectTypeMessage,
  ValidateRequiredMessage,
  ValidateStringTypeMessage,
} from '@domain/i18n/messages';

export const IsAllowedPolicyValidator = {
  user: {
    required: new ValidateRequiredMessage(),
    object: new ValidateInvalidObjectIdMessage(),
  },
  'user.sub': {
    required: new ValidateRequiredMessage(),
    uuid: new ValidateInvalidUUIDV4Message(),
  },
  allowed_for_admin: {
    boolean: new ValidateBooleanTypeMessage(),
  },
  allowed_for_organization: {
    object: new ValidateObjectTypeMessage(),
  },
  'allowed_for_organization.id_path': {
    required: new ValidateRequiredMessage(),
    string: new ValidateStringTypeMessage(),
  },
  'allowed_for_organization.roles': {
    required: new ValidateRequiredMessage(),
    array: new ValidateArrayTypeMessage(),
  },
  'allowed_for_organization.roles.*': {
    required: new ValidateRequiredMessage(),
    [`in:${Object.values(MemberRoleEnum)}`]:
      new ValidateEnumInvalidOptionMessage(Object.values(MemberRoleEnum)),
  },
};
