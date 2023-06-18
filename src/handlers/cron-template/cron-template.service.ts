import { ICacheProvider, IMongoProvider, ISecretsManagerProvider } from '../../providers';
import { ServiceBase } from '../../common/services/service-base';
import { logMethod } from '../../decorators';

export class CronTemplateService extends ServiceBase {
  constructor(
    secretManagerProvider: ISecretsManagerProvider,
    mongoProvider: IMongoProvider,
    cacheProvider: ICacheProvider,
  ) {
    super(secretManagerProvider, mongoProvider, cacheProvider);
  }

  @logMethod()
  public async methodOne(): Promise<void> {
  }

  @logMethod()
  public async methodTwo(): Promise<void> {
  }
}
