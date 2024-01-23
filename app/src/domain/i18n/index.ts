import { I18NErrorType } from './type';
import ptbr from './_pt-BR.json';
import enus from './_en-US.json';
import _ from 'lodash';

export class I18N {
  static DEFAULT_MESSAGE: I18NErrorType = {
    kind: 'error',
    title: 'unknown',
    message: 'unknown',
    solution: 'unknown',
  };

  static messages = (key: string): I18NErrorType => {
    return _.get(
      ptbr,
      key,
      _.get(enus, key, this.DEFAULT_MESSAGE),
    ) as I18NErrorType;
  };
}
