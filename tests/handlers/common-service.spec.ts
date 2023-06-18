/* eslint-disable no-undef */
import { environment } from '../../src/config/environment';
import { ServiceBase } from '../../src/common/services/service-base';
import { makeMongoProviderStub, mockedMethods as mongoMockedMethods } from '../stubs/providers/mongo.provider.stub';
import { makeSecretManagerProviderStub } from '../stubs/providers/secret-manager.provider.stub';

class FakeService extends ServiceBase {
  [x: string]: unknown;
}
const secretManagerStub = makeSecretManagerProviderStub();
const mongoStub = makeMongoProviderStub();

function mockedService(): {
  instance: FakeService;
} {
  const instance = new FakeService(secretManagerStub, mongoStub);
  return { instance };
}

const baseServiceSpies = {
  createDbConnection: jest.spyOn(ServiceBase.prototype, 'createDbConnection'),
  disconnectDb: jest.spyOn(ServiceBase.prototype, 'disconnectDb'),
  getDatabaseUri: jest.spyOn(ServiceBase.prototype, 'getDatabaseUri'),
};

describe('BaseService Test Suit', () => {
  it('should create db connection successfully', async () => {
    await mockedService().instance.createDbConnection({ uri: 'fake-connection-string' });

    expect(baseServiceSpies.createDbConnection).toHaveBeenCalledWith({ uri: 'fake-connection-string' });
  });

  it('should create db connection successfully with default credentials', async () => {
    process.env.LOCAL_CONNECTION = 'enable';

    baseServiceSpies.getDatabaseUri.mockResolvedValueOnce('fake-connection-string');
    await mockedService().instance.createDbConnection({ uri: 'fake-connection-string' });
    expect(mongoMockedMethods.connect).toHaveBeenCalledWith('fake-connection-string');
  });

  it('should get database config successfully - with local connection envvar enabled', async () => {
    process.env.LOCAL_CONNECTION = 'enable';

    const result = await mockedService().instance.getDatabaseUri(environment.IS_REPLICA_DATABASE as boolean);

    expect(result).toEqual(expect.any(String));
  });

  it('should get database config successfully - with local connection envvar disabled', async () => {
    process.env.LOCAL_CONNECTION = 'disable';

    const expected = 'mongoconfig';

    baseServiceSpies.getDatabaseUri.mockResolvedValueOnce(expected);

    const result = await mockedService().instance.getDatabaseUri(environment.IS_REPLICA_DATABASE as boolean);

    expect(result).toEqual(expected);
  });

  it('should get database config successfully - with local connection envvar disabled', async () => {
    process.env.LOCAL_CONNECTION = 'disable';

    const expected = 'mongoconfig';
    const isReplicaDatabase = true;

    baseServiceSpies.getDatabaseUri.mockResolvedValueOnce(expected);

    const result = await mockedService().instance.getDatabaseUri(isReplicaDatabase);

    expect(result).toEqual(expected);
  });

  it('should throw error if a provider wasn`t informed properly', async () => {
    process.env.LOCAL_CONNECTION = 'disable';

    const fakeNoMongoProvider = new FakeService(secretManagerStub, null);
    const fakeNoSecretManagerProvider = new FakeService(null, mongoStub);

    expect(() => fakeNoMongoProvider.createDbConnection({})).rejects.toThrowError('Mongo provider is not defined');
    expect(() => fakeNoSecretManagerProvider.getSecretManagerValue('secret')).rejects.toThrowError(
      'SecretManagerProvider is not defined',
    );
  });
});
