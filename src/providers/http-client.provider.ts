import Agent, { HttpsAgent } from 'agentkeepalive';
import got, { Got, Response } from 'got';
import { environment } from '../config/environment';
import { logMethod, ParamDecorator } from '../decorators';
import { loggerInfo } from '../utils';

export type IRequestParameters = {
  url: string;
  headers?: Record<string, string>;
  payload?: Record<string, unknown>;
  searchParams?: Record<string, string>;
};

export type IResponse<T> = {
  payload: T;
  statusCode: number;
};

export interface IHttpClientProvider {
  get<T>(params: IRequestParameters): Promise<IResponse<T>>;
  post<T>(params: IRequestParameters): Promise<IResponse<T>>;
  patch<T>(params: IRequestParameters): Promise<IResponse<T>>;
}

export class GotHttpClientProvider implements IHttpClientProvider {
  private readonly instance: Got;

  constructor() {
    this.instance = got.extend({
      responseType: 'json',
      throwHttpErrors: false,
      // keepAlive pools and reuses TCP connections, so it's faster
      agent: {
        http: new Agent({
          maxSockets: environment.KEEP_ALIVE_MAX_SOCKETS,
          maxFreeSockets: environment.KEEP_ALIVE_MAX_FREE_SOCKETS,
          timeout: environment.KEEP_ALIVE_TIMEOUT,
          freeSocketTimeout: environment.KEEP_ALIVE_FREE_SOCKET_TIMEOUT,
        }),
        https: new HttpsAgent(),
      },
      dnsCache: true,
    });
  }

  @logMethod(ParamDecorator.HIDE)
  public async get<T>(params: IRequestParameters): Promise<IResponse<T>> {
    const { url, headers, searchParams } = params;
    const response = await this.instance.get<T>(url, {
      headers,
      searchParams,
    });

    this.logRequest(params, response);

    return {
      payload: response?.body,
      statusCode: response?.statusCode,
    };
  }

  @logMethod(ParamDecorator.HIDE)
  public async post<T>(params: IRequestParameters): Promise<IResponse<T>> {
    const { url, headers, payload, searchParams } = params;
    const response = await this.instance.post<T>(url, {
      headers,
      searchParams,
      json: payload,
    });

    this.logRequest(params, response);

    return {
      payload: response?.body,
      statusCode: response?.statusCode,
    };
  }

  @logMethod(ParamDecorator.HIDE)
  public async patch<T>(params: IRequestParameters): Promise<IResponse<T>> {
    const { url, headers, payload, searchParams } = params;
    const response = await this.instance.patch<T>(url, {
      headers,
      searchParams,
      json: payload,
    });

    this.logRequest(params, response);

    return {
      payload: response?.body,
      statusCode: response?.statusCode,
    };
  }

  private logRequest(request: IRequestParameters, response: Response): void {
    const logMessage = {
      headers: request.headers,
      payload: request.payload,
      method: response.method,
      url: response.url,
      body: response.body ? response.body : {},
      status: response.statusCode,
    };

    loggerInfo('[HTTP][PROVIDER][REQUEST]', logMessage);
  }
}
