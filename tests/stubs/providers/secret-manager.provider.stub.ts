import { ISecretsManagerProvider } from '../../../src/providers';

jest.mock('../../../src/providers/secret-manager.provider.ts', () => ({
  __esModule: true,
  SecretsManagerProvider: jest.fn().mockImplementation(() => ({
    getSecretValue: jest.fn(),
  })),
}));

const mockedMethods = {
  getSecretValue: jest.fn(),
};

const makeSecretManagerProviderStub = (): ISecretsManagerProvider => {
  class SecretManagerProviderStub implements ISecretsManagerProvider {
    public async getSecretValue(secretsName: string): Promise<string> {
      return mockedMethods.getSecretValue(secretsName);
    }
  }

  return new SecretManagerProviderStub();
};

export { mockedMethods, makeSecretManagerProviderStub };
