import { UploadImageMimeEnum } from '@domain/enums/upload_mime_enum';
import {
  ValidateEnumInvalidOptionMessage,
  ValidateRequiredMessage,
  ValidateStringTypeMessage,
} from '@domain/i18n/messages';

export const SystemUploadPresignValidator = {
  extension: {
    required: new ValidateRequiredMessage(),
    string: new ValidateStringTypeMessage(),
    [`in:${Object.keys(UploadImageMimeEnum)}`]:
      new ValidateEnumInvalidOptionMessage(Object.keys(UploadImageMimeEnum)),
  },
};
