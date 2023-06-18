import Redis, { Redis as RedisClient } from 'ioredis';
import { environment } from '../config/environment';
import { loggerError, loggerInfo } from '../utils';

const cacheLogLabel = '[CACHE][PROVIDER]';

export type CacheProviderDTO = {
  key: string;
  value: unknown;
  ttl?: number;
};

export interface ICacheProvider {
  save(data: CacheProviderDTO, ttl?: number): Promise<void>;
  recover<T>(key: string): Promise<T | null>;
  getDbSize(): Promise<number>;
  delete(key: string): Promise<void>;
}

export class CacheProvider implements ICacheProvider {
  private readonly client: RedisClient;

  constructor() {
    loggerInfo('[REDIS][CONNECTING...]', { status: this.client?.status || 'no status' });
    if (environment.REDIS_USERS_HOST && environment.NODE_ENV !== 'test') {
      if (!this.client || this.client.status !== 'ready') {
        this.client = new Redis({
          host: environment.REDIS_USERS_HOST,
          maxRetriesPerRequest: 2,
        });
        loggerInfo('[REDIS][CONNECTED][SUCCESS]', { status: this.client.status });
      } else {
        loggerInfo('[REDIS][CONNECTED][CACHED_REDIS]', { status: this.client?.status || 'no status' });
      }
    }
  }

  public async save({ key, value }: CacheProviderDTO): Promise<void> {
    try {
      await this.client.set(key, JSON.stringify(value));
    } catch (e) {
      loggerError(cacheLogLabel, e);
      throw e;
    }
  }

  public async recover<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key);

      if (!data) return null;

      return JSON.parse(data) as T;
    } catch (e) {
      loggerError(cacheLogLabel, e);
      throw e;
    }
  }

  public async getDbSize(): Promise<number> {
    return this.client.dbsize();
  }

  public async delete(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (e) {
      loggerError(`${cacheLogLabel}[DELETE]`, e);
      throw e;
    }
  }
}
