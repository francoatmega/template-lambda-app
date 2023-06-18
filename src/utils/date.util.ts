import { endOfDay, startOfDay } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { environment } from '../config/environment';

export function generateLocalDatePeriod(start: Date, end: Date): { startDate: Date; endDate: Date } {
  return {
    startDate: zonedTimeToUtc(startOfDay(start), environment.TIMEZONE),
    endDate: zonedTimeToUtc(endOfDay(end), environment.TIMEZONE),
  };
}
