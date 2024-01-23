import _ from 'lodash';
import { getValue, skippable } from 'indicative-utils';
import { ValidationDataRoot } from 'indicative-compiler/build/src/Contracts';

export const validate = async (
  data: ValidationDataRoot,
  field: string,
  args,
  config,
) => {
  const fieldValue = getValue(data, field);
  if (skippable(fieldValue, field, config)) {
    return true;
  }

  if (!Object.keys(_.get(data, 'tip')).includes(args[0])) {
    // throw new Error("The first argument must to be a field on input data.")
    return false;
  }

  const targetField = args.shift();
  const targetValue = getValue(data, targetField);
  if (args.includes(targetValue)) {
    // throw new Error("This field cannot be filled if field ${args[0]} has the following values (${invalidValues.join(',')}).")
    return false;
  }

  return true;
};

export default extend => {
  extend('invalidWhen', {
    async: true,
    compile(args) {
      if (args.length < 2) {
        throw new Error(
          'InvalidWhen rule needs 2 arguments as a minimal input',
        );
      }
      return args;
    },
    validate,
  });
};
