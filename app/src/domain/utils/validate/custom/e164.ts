import libphonenumber from 'google-libphonenumber';
import { getValue, skippable } from 'indicative-utils';
import { ValidationDefination } from 'indicative-compiler';
import { ValidationDataRoot } from 'indicative-compiler/build/src/Contracts';
const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

export const validate = async (data: ValidationDataRoot, field: string) => {
  try {
    const fieldValue = getValue(data, field);
    if (skippable(fieldValue, field, { existyStrict: false })) return true;
    return phoneUtil.isPossibleNumber(phoneUtil.parse(fieldValue));
  } catch (error) {
    return false;
  }
};

export default (
  extend: (name: string, definition: ValidationDefination) => void,
) => {
  extend('e164', {
    async: true,
    validate,
  });
};
