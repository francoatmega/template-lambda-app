import { Collection, MongoClient } from 'mongodb';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { logMethod, ParamDecorator } from '../decorators';
import { environment } from '../config/environment';
import { ISecretsManagerProvider } from './secret-manager.provider';
import { loggerInfo } from '../utils';

type DbConfig = {
  mongo: string;
  certFile: string;
};

export interface IMongoProvider {
  connect(uri: string): Promise<void>;
  disconnect(): Promise<void>;
  collection(name: string): Collection;
}

export class MongoProvider implements IMongoProvider {
  private client: MongoClient;

  constructor(private readonly secretManagerProvider: ISecretsManagerProvider) {}

  @logMethod(ParamDecorator.HIDE)
  public async connect(uri: string): Promise<void> {
    let certFile: string | Buffer;

    if (process.env.LOCAL_CONNECTION === 'enable') {
      const certDir = path.join(__dirname, '..', '..', '..', 'certs');
      certFile = environment.NODE_ENV === 'test' ? '' : fs.readFileSync(`${certDir}/mongo-cert.pem`);
    } else {
      const secret = await this.secretManagerProvider.getSecretValue(environment.DATABASE_CONN_SECRET);

      const databaseConfig: DbConfig = JSON.parse(
        environment.NODE_ENV === 'test' ? '{"mongo":"","certFile":""}' : secret,
      );

      certFile = databaseConfig.certFile.replace(/\n/g, os.EOL);
    }
    if (!this.client?.isConnected()) {
      loggerInfo('[MONGO_PROVIDER][CONNECT]');

      this.client = await MongoClient.connect(uri, {
        useNewUrlParser: true,
        sslCA: [certFile],
        useUnifiedTopology: true,
      });
    }
  }

  public async disconnect(): Promise<void> {
    await this.client.close();

    this.client = null;
  }

  @logMethod()
  public collection(name: string): Collection {
    return this.client.db().collection(name);
  }
}
