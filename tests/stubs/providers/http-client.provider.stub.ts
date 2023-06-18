import { IRequestParameters, IHttpClientProvider } from '../../../src/providers';

jest.mock('../../../src/providers/http-client.provider.ts', () => {
  return {
    __esModule: true,
    GotHttpClientProvider: jest.fn().mockImplementation(() => {
      return {
        get: jest.fn(),
        post: jest.fn(),
        patch: jest.fn(),
      };
    }),
  };
});

const mockedMethods = {
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
};

const makeHttpClientProviderStub = (mockedResponse: Record<string, unknown>): IHttpClientProvider => {
  class FakeHttpClientProvider implements IHttpClientProvider {
    public async get<T>(_params: IRequestParameters): Promise<T> {
      return mockedMethods.get(mockedResponse as T);
    }

    public async post<T>(_params: IRequestParameters): Promise<T> {
      return mockedMethods.post(mockedResponse as T);
    }

    public async patch<T>(_params: IRequestParameters): Promise<T> {
      return mockedMethods.post(mockedResponse as T);
    }
  }

  return new FakeHttpClientProvider();
};

export { mockedMethods, makeHttpClientProviderStub };
