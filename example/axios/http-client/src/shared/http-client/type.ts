import {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
} from "axios";

type RequestOptions = {
  showError?: boolean;
};

export interface HttpParams {
  config: CreateAxiosDefaults & RequestOptions;
}

export type HttpRequestConfig = AxiosRequestConfig & RequestOptions;

export interface HttpResponse<T = any> extends AxiosResponse {
  data: T;
}

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
