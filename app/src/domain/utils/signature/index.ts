import { createHmac } from 'crypto';
import { equals } from 'ramda';
import qs from 'qs';

export class SignatureUtil {
  secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  sign(data: object | string): string {
    if (typeof data === 'string')
      return createHmac('sha1', this.secret).update(data).digest('hex');
    else
      return createHmac('sha1', this.secret)
        .update(qs.stringify(data))
        .digest('hex');
  }

  isValid(data: object | string, signature: string): boolean {
    return equals(signature, this.sign(data));
  }
}
