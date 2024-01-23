import { Request } from 'express';
import momentTz, { Moment } from 'moment-timezone';
const DEFAULT_TZ = 'America/Sao_Paulo';

export class DateUtil {
  date: Moment;
  timezone: string;
  constructor() {
    this.date = momentTz();
    this.timezone = DEFAULT_TZ;
  }

  setTimezone(req: Request) {
    this.timezone = req.headers.location || DEFAULT_TZ;
  }

  normalize(date?: string | Date, utc = true): Moment {
    return momentTz(date).tz(this.timezone).utc(utc);
  }

  info(): string | undefined {
    const timeInfo = momentTz.tz.zone(this.timezone);
    return timeInfo?.name;
  }

  names(): string[] {
    return momentTz.tz.names();
  }
}
