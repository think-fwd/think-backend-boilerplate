import { getValue, skippable } from 'indicative-utils';
import { ValidationDefination } from 'indicative-compiler';
import { ValidationDataRoot } from 'indicative-utils/build/src/contracts';

export const validate = async (data: ValidationDataRoot, field: string) => {
  try {
    const fieldValue = getValue(data, field);
    if (skippable(fieldValue, field, { existyStrict: false })) return true;
    return Object.keys(fieldValue).length > 0;
  } catch (error) {
    return false;
  }
};

export default (
  extend: (name: string, definition: ValidationDefination) => void,
) => {
  extend('objectNotEmpty', {
    async: true,
    validate,
  });
};
