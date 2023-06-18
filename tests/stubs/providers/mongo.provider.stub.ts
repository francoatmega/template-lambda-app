import { Collection } from 'mongodb';
import { IMongoProvider } from '../../../src/providers';

jest.mock('../../../src/providers/mongo.provider.ts', () => ({
  __esModule: true,
  MongoProvider: jest.fn().mockImplementation(() => ({
    sendEmail: jest.fn(),
  })),
}));

const mockedMethods = {
  connect: jest.fn(),
  disconnect: jest.fn(),
  collection: jest.fn(),
};

const makeMongoProviderStub = (): IMongoProvider => {
  class MongoProviderStub implements IMongoProvider {
    public async connect(uri: string): Promise<void> {
      return mockedMethods.connect(uri);
    }

    public async disconnect(): Promise<void> {
      return mockedMethods.disconnect();
    }

    public collection(name: string): Collection {
      return mockedMethods.collection(name);
    }
  }

  return new MongoProviderStub();
};

export { mockedMethods, makeMongoProviderStub };
