import { loggerInfo } from '../../utils';
import { environment } from '../../config/environment';

import { CacheProviderDTO, ICacheProvider, IMongoProvider, ISecretsManagerProvider } from '../../providers';

export type DbConnectionOption = {
  isReplicaDatabase?: boolean;
  uri?: string;
};

export abstract class ServiceBase {
  constructor(
    public readonly secretManagerProvider?: ISecretsManagerProvider,
    public readonly mongoProvider?: IMongoProvider,
    public readonly cacheProvider?: ICacheProvider,
  ) {}

  public async createDbConnection(options: DbConnectionOption): Promise<void> {
    this.verifyMongoProvider();

    const { isReplicaDatabase, uri } = options;
    let dbUri: string = uri;

    if (!dbUri) {
      dbUri = await this.getDatabaseUri(isReplicaDatabase);
    }
    await this.mongoProvider.connect(dbUri);
  }

  public async disconnectDb(): Promise<void> {
    try {
      await this.mongoProvider.disconnect();
    } catch {
      loggerInfo('Connection already closed');
    }
  }

  public async getDatabaseUri(isReplicaDatabase: boolean): Promise<string> {
    let mongoUri = '';

    if (process.env.LOCAL_CONNECTION === 'enable') {
      return process.env.MONGO_URL;
    }

    const secret = await this.getSecretManagerValue(environment.DATABASE_CONN_SECRET);

    if (isReplicaDatabase) {
      const { mongoReplica } = JSON.parse(secret);
      mongoUri = mongoReplica;
      return mongoUri;
    }

    const { mongo } = JSON.parse(secret);
    mongoUri = mongo;

    return mongoUri;
  }

  public async getSecretManagerValue(secret: string): Promise<string> {
    this.verifySecretManagerProvider();
    return this.secretManagerProvider.getSecretValue(secret);
  }

  public async saveCacheProvider(data: CacheProviderDTO, ttl?: number): Promise<void> {
    await this.cacheProvider.save(data, ttl);
  }

  private verifySecretManagerProvider(): void {
    if (!this.secretManagerProvider) {
      throw new Error('SecretManagerProvider is not defined');
    }
  }

  private verifyMongoProvider(): void {
    if (!this.mongoProvider) {
      throw new Error('Mongo provider is not defined');
    }
  }
}
