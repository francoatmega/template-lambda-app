import { ICacheProvider, CacheProviderDTO } from '../../../src/providers';

jest.mock('../../../src/providers/cache.provider.ts', () => ({
  __esModule: true,
  CacheProvider: jest.fn().mockImplementation(() => ({
    save: jest.fn(),
    recover: jest.fn(),
    getDbSize: jest.fn(),
    delete: jest.fn(),
  })),
}));

type ICacheData = {
  [key: string]: string;
};

export class CacheProviderStub implements ICacheProvider {
  private cache: ICacheData;

  constructor() {
    this.cache = {} as ICacheData;
  }

  public async save({ key, value }: CacheProviderDTO, _ttl: number): Promise<void> {
    this.cache[key] = JSON.stringify(value);
  }

  public async recover<T>(key: string): Promise<T | null> {
    try {
      const data = JSON.parse(this.cache[key]);
      if (!data) {
        return null;
      }
      return data as T;
    } catch {
      return null;
    }
  }

  public async getDbSize(): Promise<number> {
    return Promise.resolve(Object.keys(this.cache).length);
  }

  public async delete(key: string): Promise<void> {
    this.cache[key] = JSON.stringify(key);
  }
}
