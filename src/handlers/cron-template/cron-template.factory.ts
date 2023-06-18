import { CacheProvider, MongoProvider, SecretsManagerProvider } from '../../providers';
import { CronTemplateService } from './cron-template.service';

export const cacheProvider = new CacheProvider();
export const secretsManagerProvider = new SecretsManagerProvider();
export const mongoProvider = new MongoProvider(secretsManagerProvider);

export const cronTemplateService = new CronTemplateService(
  secretsManagerProvider,
  mongoProvider,
  cacheProvider
);
