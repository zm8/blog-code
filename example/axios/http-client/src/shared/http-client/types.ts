import {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
} from "axios";

export interface ResponseHandler<T = any> {
  handle(response: HttpResponse<any>): Promise<T>;
}

// 修改 ResponseType 的定义
export type ResponseType<T, R> = CancellablePromise<
  R extends ResponseHandler<T> ? T : HttpResponse<T>
>;

export interface HttpResponse<T = any> extends AxiosResponse {
  data: T;
}

// 定义 BaseHttp constructor 的配置
export interface BaseHttpOptions {
  config?: CreateAxiosDefaults & RequestOptions;
  responseHandler?: ResponseHandler;
}

type RequestOptions = {
  showError?: boolean;
};

export type HttpRequestConfig = AxiosRequestConfig & RequestOptions;

export type HttpError = AxiosError & {
  config?: HttpRequestConfig;
};

export interface CancellablePromise<T> extends Promise<T> {
  cancel: () => void;
}

export interface UploadRequestConfig extends HttpRequestConfig {
  onProgress?: (percentage: number) => void;
  onUploadComplete?: (response: any) => void;
  onUploadError?: (error: Error) => void;
}

export enum ErrorCode {
  SUCCESS = "00000",
  NETWORK_ERROR = "ERR_NETWORK",
  TIMEOUT = "ECONNABORTED",
  CANCELED = "ERR_CANCELED",
  SERVER_ERROR = "ERR_BAD_RESPONSE",
  REQUEST_ERROR = "ERR_BAD_REQUEST",
}
