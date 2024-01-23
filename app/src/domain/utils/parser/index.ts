import _ from 'lodash';
import moment from 'moment';
import { ObjectId } from 'mongodb';
import { isValid } from 'date-fns';

export class ParserUtil {
  // ********************************************** //
  // ** allow static access to private fucntions ** //
  // ********************************************** //

  public static parseInt(
    value: string | undefined,
    defaultValue: number,
  ): number {
    return new ParserUtil().parseInt(value, defaultValue);
  }

  public static replaceTokens(
    message: string | undefined,
    tokens?: Record<string, string>,
  ): string | undefined {
    return new ParserUtil().replaceTokens(message, tokens);
  }

  // ************************************* //
  // ** definition of private fucntions ** //
  // ************************************* //

  public parseInt(value: string | undefined, defaultValue: number): number {
    const num = parseInt(String(value), 10);
    return isNaN(num) ? defaultValue : num;
  }

  public minDateTime(date?: string) {
    try {
      if (!date) throw new Error('invalid date');
      const parsed = moment(date, true).utc(true).startOf('day').toDate();
      if (!isValid(parsed)) throw new Error('invalid date');
      return parsed;
    } catch (error) {
      return undefined;
    }
  }

  public maxDateTime(date?: string) {
    try {
      if (!date) throw new Error('invalid date');
      const parsed = moment(date, false).utc(true).endOf('day').toDate();
      if (!isValid(parsed)) throw new Error('invalid date');
      return parsed;
    } catch (error) {
      return undefined;
    }
  }

  public static removeUndefindeds(data: Record<string, unknown>) {
    for (const key in data) {
      if (data[key] === undefined) {
        _.unset(data, key);
      }
    }
    return data;
  }

  public extractDomainFromEmail(email: string): string | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return null;
    const domainRegex = /@([^\s@]+\.[^\s@]+)$/;
    const matches = email.match(domainRegex);
    if (matches && matches.length > 1) return matches[1];
    return null;
  }

  public extractMentionsFromString(input?: string): string[] {
    if (!input) return [];
    const mentionPattern = /@\[([^\]]+)\]\(([^)]+)\)/g;
    const mentions: string[] = [];
    let match;
    while ((match = mentionPattern.exec(input)) !== null) {
      const mentionedId = match[2];
      const objectId = new ObjectId(mentionedId);
      mentions.push(objectId.toHexString());
    }
    return mentions;
  }

  public replaceTokens(
    message: string | undefined,
    tokens?: Record<string, string>,
  ): string | undefined {
    if (!tokens) return message;
    let tmpMessage = message;
    for (const key in tokens) {
      tmpMessage = tmpMessage?.replace(`{{${key}}}`, tokens[key]);
    }
    return tmpMessage;
  }

  public extractLastPathFromUrl(url: string): string | null {
    try {
      const parsedUrl = new URL(url);
      const pathSegments = parsedUrl.pathname
        .split('/')
        .filter(segment => segment !== '');

      if (pathSegments.length > 0) {
        return pathSegments[pathSegments.length - 1];
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Invalid URL: ${error}`);
      return null;
    }
  }
}
