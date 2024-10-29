import {
  Axios,
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
} from "axios";

type RequestOptions = {
  showError?: boolean;
};

type InterceptorsRequestUse = Parameters<
  Axios["interceptors"]["request"]["use"]
>;

type InterceptorsResponseUse = Parameters<
  Axios["interceptors"]["response"]["use"]
>;

export interface HttpParams {
  config: CreateAxiosDefaults & RequestOptions;
  interceptors: {
    request?: {
      onFulfilled?: InterceptorsRequestUse[0];
      onRejected?: InterceptorsRequestUse[1];
    };
    response?: {
      onFulfilled?: InterceptorsResponseUse[0];
      onRejected?: InterceptorsResponseUse[1];
    };
  };
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
}
