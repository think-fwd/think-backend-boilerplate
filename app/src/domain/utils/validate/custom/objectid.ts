import { ValidationDefination } from 'indicative-compiler';
import { ValidationDataRoot } from 'indicative-compiler/build/src/Contracts';
import { getValue, skippable } from 'indicative-utils';
import { ObjectId } from 'mongodb';

export const validate = async (data: ValidationDataRoot, field: string) => {
  try {
    const fieldValue = getValue(data, field);
    if (skippable(fieldValue, field, { existyStrict: false })) return true;
    return ObjectId.isValid(fieldValue);
  } catch (error) {
    return false;
  }
};

export default (
  extend: (name: string, definition: ValidationDefination) => void,
) => {
  extend('objectid', {
    async: true,
    validate,
  });
};
