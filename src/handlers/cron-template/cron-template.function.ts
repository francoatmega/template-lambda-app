import { ScheduledHandler } from 'aws-lambda';
import { loggerInfo, loggerError } from '../../utils';
import { Log } from '../../types';
import { cronTemplateService } from './cron-template.factory';
import { CronTemplateType } from './cron-template.types';

export const cronTemplate: ScheduledHandler = async (_event, context): Promise<void> => {
  const LOG_OBJECT: Log<CronTemplateType> = {
    success: false,
    data: {
      type1: 0,
      type2: 0,
      type3: 0
    }
  };

  cronTemplateService.methodOne();

  cronTemplateService.methodTwo();

  context.callbackWaitsForEmptyEventLoop = false;

  try {
    LOG_OBJECT.success = true;
    loggerInfo('[CRON_TEMPLATE][FUNCTION][DONE]', LOG_OBJECT);
  } catch (error) {
    LOG_OBJECT.error = 'ERROR DETAIL';
    loggerError('[CRON_TEMPLATE][FUNCTION][ERROR]', LOG_OBJECT);
  }
};
