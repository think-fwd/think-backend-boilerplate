import { Message } from '@domain/i18n/message';

export class MissingPropsError extends Message {
  constructor() {
    super(400, MissingPropsError.name);
  }
}

export class UserInvalidPasswordError extends Message {
  constructor() {
    super(400, UserInvalidPasswordError.name);
  }
}

export class ErrorUserDoesNotHavePermission extends Message {
  constructor() {
    super(403, ErrorUserDoesNotHavePermission.name);
  }
}

export class UserNotFoundedError extends Message {
  constructor() {
    super(400, UserNotFoundedError.name);
  }
}

export class MissingAuthorizationTokenFailure extends Message {
  constructor() {
    super(401, MissingAuthorizationTokenFailure.name);
  }
}

export class UnauthorizedTokenFailure extends Message {
  constructor() {
    super(401, UnauthorizedTokenFailure.name);
  }
}

export class ErrorFilePresignUrlGeneration extends Message {
  constructor() {
    super(400, ErrorFilePresignUrlGeneration.name);
  }
}

export class ErrorFileNotUploaded extends Message {
  constructor() {
    super(400, ErrorFileNotUploaded.name);
  }
}

export class ErrorInvalidScrumCredentials extends Message {
  constructor() {
    super(400, ErrorInvalidScrumCredentials.name);
  }
}

export class ErrorInvalidScrumAccount extends Message {
  constructor() {
    super(400, ErrorInvalidScrumAccount.name);
  }
}

export class ErrorInvalidRepositoryCredentials extends Message {
  constructor() {
    super(400, ErrorInvalidRepositoryCredentials.name);
  }
}

export class ErrorOauthRepositoryMissingAccessToken extends Message {
  constructor() {
    super(400, ErrorOauthRepositoryMissingAccessToken.name);
  }
}

export class ErrorOauthRepositoryMissing extends Message {
  constructor() {
    super(400, ErrorOauthRepositoryMissing.name);
  }
}

export class ErrorOauthRepositoryDisconnected extends Message {
  constructor() {
    super(400, ErrorOauthRepositoryDisconnected.name);
  }
}

export class ErrorMemberInviteNotPending extends Message {
  constructor() {
    super(400, ErrorMemberInviteNotPending.name);
  }
}

export class ErrorMemberNotFounded extends Message {
  constructor() {
    super(400, ErrorMemberNotFounded.name);
  }
}

export class ErrorMemberSelfDeleted extends Message {
  constructor() {
    super(400, ErrorMemberSelfDeleted.name);
  }
}

export class ErrorMemberAlreadyInvited extends Message {
  constructor() {
    super(400, ErrorMemberAlreadyInvited.name);
  }
}

// ######################### //
// ## SUCCESS MESSAGES    ## //
// ######################### //

export class SuccessUserRegistration extends Message {
  constructor(email: string) {
    super(200, SuccessUserRegistration.name, { tokens: { email: email } });
  }
}

export class SuccessUserActivation extends Message {
  constructor() {
    super(200, SuccessUserActivation.name);
  }
}

// ######################### //
// ## VALIDATION MESSAGES ## //
// ######################### //

export class ValidateRequiredMessage extends Message {
  constructor() {
    super(400, ValidateRequiredMessage.name);
  }
}

export class ValidateStringTypeMessage extends Message {
  constructor() {
    super(400, ValidateStringTypeMessage.name);
  }
}

export class ValidateNumberTypeMessage extends Message {
  constructor() {
    super(400, ValidateNumberTypeMessage.name);
  }
}

export class ValidateBooleanTypeMessage extends Message {
  constructor() {
    super(400, ValidateBooleanTypeMessage.name);
  }
}

export class ValidateArrayTypeMessage extends Message {
  constructor() {
    super(400, ValidateArrayTypeMessage.name);
  }
}

export class ValidateObjectTypeMessage extends Message {
  constructor() {
    super(400, ValidateObjectTypeMessage.name);
  }
}

export class ValidateEnumInvalidOptionMessage extends Message {
  constructor(options: string[]) {
    super(400, ValidateEnumInvalidOptionMessage.name, {
      tokens: { options: options.join(', ') },
    });
  }
}

export class ValidateMinLengthMessage extends Message {
  constructor(size: number) {
    super(400, ValidateMinLengthMessage.name, {
      tokens: { size: String(size) },
    });
  }
}

export class ValidateMaxLengthMessage extends Message {
  constructor(size: number) {
    super(400, ValidateMaxLengthMessage.name, {
      tokens: { size: String(size) },
    });
  }
}

export class ValidateInvalidEmailMessage extends Message {
  constructor() {
    super(400, ValidateInvalidEmailMessage.name);
  }
}

export class ValidateInvalidObjectIdMessage extends Message {
  constructor() {
    super(400, ValidateInvalidObjectIdMessage.name);
  }
}

export class ValidateInvalidUUIDV4Message extends Message {
  constructor() {
    super(400, ValidateInvalidUUIDV4Message.name);
  }
}

export class ValidateInvalidE164Message extends Message {
  constructor() {
    super(400, ValidateInvalidE164Message.name);
  }
}

export class ValidateInvalidCnpjMessage extends Message {
  constructor() {
    super(400, ValidateInvalidCnpjMessage.name);
  }
}

export class ValidateInvalidCpfMessage extends Message {
  constructor() {
    super(400, ValidateInvalidCpfMessage.name);
  }
}

export class ValidateInvalidCpfjMessage extends Message {
  constructor() {
    super(400, ValidateInvalidCpfjMessage.name);
  }
}

export class ValidateInvalidCepMessage extends Message {
  constructor() {
    super(400, ValidateInvalidCepMessage.name);
  }
}

export class ValidateInvalidDateTimeFormatMessage extends Message {
  constructor(format: string) {
    super(400, ValidateInvalidDateTimeFormatMessage.name, {
      tokens: { format },
    });
  }
}

export class ValidateNotConfirmedMessage extends Message {
  constructor() {
    super(400, ValidateNotConfirmedMessage.name);
  }
}

export class ValidateInvalidRangeMessage extends Message {
  constructor(rangeStart: number, rangeEnd: number) {
    super(400, ValidateInvalidRangeMessage.name, {
      tokens: {
        range_start: String(rangeStart),
        range_end: String(rangeEnd),
      },
    });
  }
}
