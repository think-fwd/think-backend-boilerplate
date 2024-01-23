import _ from 'lodash';
import { Message } from '@domain/i18n/message';
import { validateAll, extend } from 'indicative/validator';
import { Schema, Messages } from 'indicative-parser';

// import custom validations
import CUSTOM_VALIDATION_E164 from './custom/e164';
import CUSTOM_VALIDATION_CPFJ from './custom/cpfj';
import CUSTOM_VALIDATION_CNPJ from './custom/cnpj';
import CUSTOM_VALIDATION_CPF from './custom/cpf';
import CUSTOM_VALIDATION_CEP from './custom/cep';
import CUSTOM_VALIDATION_UUID from './custom/uuid';
import CUSTOM_VALIDATION_EMPTY from './custom/empty';
import CUSTOM_VALIDATION_OBJECTID from './custom/objectid';
import CUSTOM_VALIDATION_DATETIME from './custom/datetime';
import CUSTOM_VALIDATION_INVALID_WHEN from './custom/invalid_when';
import CUSTOM_VALIDATION_OBJECT_NOT_EMPTY from './custom/object_not_empty';
import CUSTOM_VALIDATION_REQUIREDONCE from './custom/requiredonce';

// extends custom validations
CUSTOM_VALIDATION_E164(extend);
CUSTOM_VALIDATION_CPFJ(extend);
CUSTOM_VALIDATION_CNPJ(extend);
CUSTOM_VALIDATION_CPF(extend);
CUSTOM_VALIDATION_CEP(extend);
CUSTOM_VALIDATION_UUID(extend);
CUSTOM_VALIDATION_EMPTY(extend);
CUSTOM_VALIDATION_OBJECTID(extend);
CUSTOM_VALIDATION_DATETIME(extend);
CUSTOM_VALIDATION_INVALID_WHEN(extend);
CUSTOM_VALIDATION_OBJECT_NOT_EMPTY(extend);
CUSTOM_VALIDATION_REQUIREDONCE(extend);

export class ValidationException extends Message {
  constructor(errors: Array<unknown>) {
    super(400, ValidationException.name, {
      errors: errors.reduce(
        (
          obj: Record<string, string>,
          cur: { field: string; message: string },
        ) => ({ ...obj, [cur.field]: cur.message }),
        {},
      ) as Record<string, unknown>,
    });
  }
}

const build = (
  schema: Record<string, Record<string, Message>>,
): { builtSchema: Schema; builtMessages: Messages } => {
  const builtSchema: Schema = {};
  const builtMessages: Messages = {} as Messages;
  for (const field in schema) {
    if (_.isEmpty(schema[field])) continue;
    builtSchema[field] = Object.keys(schema[field]).join('|');
    for (const rule in schema[field]) {
      builtMessages[`${field}.${rule.split(':')[0]}`] =
        schema[field][rule].message;
    }
  }
  return { builtSchema, builtMessages };
};

export const validate = async (
  data: Record<string, unknown>,
  schema: Record<string, Record<string, Message>>,
): Promise<boolean> => {
  const { builtSchema, builtMessages } = build(schema);
  return new Promise((resolve, reject) => {
    validateAll(data, builtSchema, builtMessages)
      .then(() => {
        resolve(true);
      })
      .catch(error => {
        reject(new ValidationException(error));
      });
  });
};
