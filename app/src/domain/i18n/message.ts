import { I18N } from '@domain/i18n';
import { ParserUtil } from '../utils/parser';

export class Message implements Error {
  kind: 'error' | 'success';
  code: number;
  name: string;
  message: string;
  title?: string;
  errors?: Record<string, unknown> | Array<unknown>;
  stack?: string | undefined;
  redirect?: string;
  solution?: string;
  constructor(
    code: number,
    name: string,
    options?: {
      message?: string;
      errors?: Record<string, unknown> | Array<unknown>;
      redirect?: string;
      solution?: string;
      tokens?: Record<string, string>;
    },
  ) {
    const i18n = I18N.messages(name);
    this.name = name;
    this.code = code;
    // if message throws status codes 2.x.x then is a success http
    this.kind = String(code).startsWith('2') ? 'success' : 'error';
    this.errors = options?.errors;
    this.title = ParserUtil.replaceTokens(i18n.title, options?.tokens);
    this.message = ParserUtil.replaceTokens(
      options?.message || i18n.message,
      options?.tokens,
    ) as string;
    this.solution = ParserUtil.replaceTokens(
      options?.solution || i18n.solution,
      options?.tokens,
    );
    this.redirect = ParserUtil.replaceTokens(
      options?.redirect,
      options?.tokens,
    );
  }
}
