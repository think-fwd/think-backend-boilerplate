import _ from 'lodash';
import { ValidationDefination } from 'indicative-compiler';
import { ValidationDataRoot } from 'indicative-utils/build/src/contracts';

export const validate = async (
  data: ValidationDataRoot,
  _field,
  [compareFieldKey, compareFieldValue]: string[],
) => {
  if (!compareFieldKey || !compareFieldValue) {
    throw new Error('args must to have 2 values');
  }
  try {
    const pointer = _.get(data, 'pointer');
    if (!pointer) throw new Error('no pointer provided');
    const fieldValue = _.get(data, ['original', compareFieldKey].join('.'));
    if (
      String(fieldValue) === String(compareFieldValue) &&
      !_.get(data, ['original', pointer].join('.'))
    ) {
      throw new Error('value not provided and target field is equals to value');
    }
    return true;
  } catch (error) {
    return false;
  }
};

export default (
  extend: (name: string, definition: ValidationDefination) => void,
) => {
  extend('requiredonce', {
    async: true,
    validate,
  });
};
