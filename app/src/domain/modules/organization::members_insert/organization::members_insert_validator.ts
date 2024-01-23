import { MemberRoleEnum } from '@domain/enums/member_role_enum';
import {
  ValidateRequiredMessage,
  ValidateInvalidEmailMessage,
  ValidateInvalidObjectIdMessage,
  ValidateEnumInvalidOptionMessage,
} from '@domain/i18n/messages';

export const OrganizationMembersInsertValidator = {
  organization_id: {
    required: new ValidateRequiredMessage(),
    objectid: new ValidateInvalidObjectIdMessage(),
  },
  email: {
    required: new ValidateRequiredMessage(),
    email: new ValidateInvalidEmailMessage(),
  },
  role: {
    required: new ValidateRequiredMessage(),
    [`in:${Object.values(MemberRoleEnum).join(',')}`]:
      new ValidateEnumInvalidOptionMessage(Object.values(MemberRoleEnum)),
  },
};
