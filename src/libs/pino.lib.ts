import pino from 'pino';
import { environment } from '../config/environment';

export const logger = pino({
  name: environment.APP_TITLE,
  level: environment.NODE_ENV === 'test' ? 'silent' : 'info',
  formatters: {
    level: (label: string): Record<string, unknown> => ({ level: label }),
  },
  enabled: true,
  redact: {
    paths: environment.OBFUSCATE_KEYWORDS,
    censor: '***',
  },
});
