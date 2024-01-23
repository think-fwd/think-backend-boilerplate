import _ from 'lodash';
import { Response } from 'express';
import { Message } from '@domain/i18n/message';

export const handleError = (
  response: Response,
  error: Error | Message | Record<string, unknown>,
): Response => {
  const errorContent = _.merge(
    {
      code: _.get(error, 'code', 400),
      kind: 'error',
      name: 'UnknownError',
      title: 'Unknown Error',
      message: _.get(error, 'message', 'Unknown message'),
      solution: _.get(error, 'solution'),
    },
    error,
  );

  // return mounted json error
  response.status(errorContent.code);
  response.json(errorContent);
  return response;
};
