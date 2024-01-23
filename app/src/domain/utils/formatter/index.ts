import { lightFormat, parseISO } from 'date-fns';

export class FormatterUtil {
  public truncate(message: string | undefined | null, maxSize = 50) {
    if (!message) return null;
    return `${message.slice(0, maxSize)}${
      message.length > maxSize ? '...' : ''
    }`;
  }
  public formatFromDate(dateISO: Date) {
    try {
      const dateISOUTC = new Date(
        dateISO.valueOf() + dateISO.getTimezoneOffset() * 60 * 1000,
      );
      return lightFormat(dateISOUTC, 'dd/MM/yyyy');
    } catch (error) {
      return '--';
    }
  }

  public formatDate(date: string) {
    try {
      const dateISO = parseISO(date);
      const dateISOUTC = new Date(
        dateISO.valueOf() + dateISO.getTimezoneOffset() * 60 * 1000,
      );
      return lightFormat(dateISOUTC, 'dd/MM/yyyy');
    } catch (error) {
      return '--';
    }
  }

  public formatDateTime(date: string) {
    try {
      const dateISO = parseISO(date);
      const dateISOUTC = new Date(
        dateISO.valueOf() + dateISO.getTimezoneOffset() * 60 * 1000,
      );
      return lightFormat(dateISOUTC, "dd/MM/yyyy 'às' HH:mm");
    } catch (error) {
      return '--';
    }
  }
}
