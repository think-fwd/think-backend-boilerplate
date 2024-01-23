import { MemberRoleEnum } from '@domain/enums/member_role_enum';
import {
  ValidateRequiredMessage,
  ValidateBooleanTypeMessage,
  ValidateEnumInvalidOptionMessage,
  ValidateInvalidObjectIdMessage,
} from '@domain/i18n/messages';

export const OrganizationMembersUpdateValidator = {
  id: {
    required: new ValidateRequiredMessage(),
    objectid: new ValidateInvalidObjectIdMessage(),
  },
  organization_id: {
    required: new ValidateRequiredMessage(),
    objectid: new ValidateInvalidObjectIdMessage(),
  },
  blocked: {
    boolean: new ValidateBooleanTypeMessage(),
  },
  role: {
    required: new ValidateRequiredMessage(),
    [`in:${Object.values(MemberRoleEnum).join(',')}`]:
      new ValidateEnumInvalidOptionMessage(Object.values(MemberRoleEnum)),
  },
};
