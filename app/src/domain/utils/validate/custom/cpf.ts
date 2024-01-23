import { isCpf } from 'validator-brazil';
import { getValue, skippable } from 'indicative-utils';
import { ValidationDefination } from 'indicative-compiler';
import { ValidationDataRoot } from 'indicative-compiler/build/src/Contracts';

export const validate = async (data: ValidationDataRoot, field: string) => {
  try {
    const fieldValue = getValue(data, field);
    if (skippable(fieldValue, field, { existyStrict: false })) return true;
    return isCpf(fieldValue);
  } catch (error) {
    return false;
  }
};

export default (
  extend: (name: string, definition: ValidationDefination) => void,
) => {
  extend('cpf', {
    async: true,
    validate,
  });
};
