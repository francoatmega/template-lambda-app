import { logger } from '../libs/pino.lib';
import { environment } from '../config/environment';

const mountLogObject = (label: string, message?: unknown): Record<string, unknown> => ({
  label,
  message: message || undefined,
  environment: environment.NODE_ENV,
  date: new Date(),
});

const loggerInfo = (label: string, info?: unknown): void => {
  const logObject = mountLogObject(label, info);

  logger.info(logObject);
};

const loggerError = (label: string, error: unknown): void => {
  const logObject = mountLogObject(label, error);

  logger.error(logObject);
};

export { loggerInfo, loggerError, logger };
