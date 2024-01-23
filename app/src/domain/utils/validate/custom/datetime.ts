import { parse, isValid } from 'date-fns';
import { getValue, skippable } from 'indicative-utils';
import { ValidationDefination } from 'indicative-compiler';
import { ValidationDataRoot } from 'indicative-utils/build/src/contracts';

export const validate = async (
  data: ValidationDataRoot,
  field: string,
  args?: string[],
) => {
  try {
    const fieldValue = getValue(data, field);
    if (skippable(fieldValue, field, { existyStrict: false })) return true;
    const formatPattern = args?.[0] || 'yyyy-MM-dd HH:mm';
    const parseDate = parse(fieldValue, formatPattern, new Date());
    return isValid(parseDate);
  } catch (error) {
    return false;
  }
};

export default (
  extend: (name: string, definition: ValidationDefination) => void,
) => {
  extend('datetime', {
    async: true,
    validate,
  });
};
