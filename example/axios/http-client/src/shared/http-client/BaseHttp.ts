import axios, { AxiosInstance } from "axios";
import {
  CancellablePromise,
  HttpError,
  HttpParams,
  HttpResponse,
  HttpRequestConfig,
  UploadRequestConfig,
  ErrorCode,
} from "./type";

export abstract class BaseHttp {
  protected instance: AxiosInstance;
  private pendingRequests: Map<number, AbortController> = new Map();
  private requestId = 1;

  constructor(params: HttpParams) {
    this.instance = axios.create(params.config);
    this.setupBaseInterceptors();
  }

  protected abstract setupInterceptors(): void;

  private setupBaseInterceptors(): void {
    this.instance.interceptors.request.use(
      (config) => {
        const isGet = config.method?.toUpperCase() === "GET";
        return {
          ...config,
          params: isGet ? config.params : undefined,
          data: !isGet ? config.params : undefined,
        };
      },
      (error: HttpError) => Promise.reject(error),
    );

    this.instance.interceptors.response.use(
      (response) =>
        response.config.responseType === "blob" ? response : response.data,
      (error: HttpError) => {
        this.handleError(error);
        return Promise.reject(error);
      },
    );
  }

  private handleError(error: HttpError): void {
    if (error.code !== ErrorCode.CANCELED && error.config?.showError) {
      console.error(this.getErrorMessage(error));
    }
    this.logError(error);
  }

  private logError(error: HttpError): void {
    console.error("[HTTP Error]", {
      code: error.code,
      status: error.status,
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
    });
  }

  private getErrorMessage(error: HttpError): string {
    const errorMessages = {
      [ErrorCode.NETWORK_ERROR]: "网络连接异常，请检查网络设置",
      [ErrorCode.TIMEOUT]: "请求超时，请稍后重试",
      [ErrorCode.CANCELED]: "请求已取消",
      [ErrorCode.SERVER_ERROR]: `服务器错误 (${error.status}): ${error.message}`,
      [ErrorCode.REQUEST_ERROR]: `请求错误 (${error.status}): ${error.message}`,
    };
    return (
      errorMessages[error.code as keyof typeof errorMessages] ||
      error.message ||
      "未知错误"
    );
  }

  request<T = any>(
    config: HttpRequestConfig,
  ): CancellablePromise<HttpResponse<T>> {
    if (!config.signal) {
      const requestId = this.requestId++;
      const controller = new AbortController();
      config.signal = controller.signal;
      this.pendingRequests.set(requestId, controller);

      const promise = this.instance.request(config).finally(() => {
        this.pendingRequests.delete(requestId);
      });

      return Object.assign(promise, {
        cancel: () => controller.abort(),
      });
    }

    return Object.assign(this.instance.request(config), {
      cancel: () => {}, // 外部控制的 signal，不需要我们处理取消
    });
  }

  cancelAllRequests(): void {
    this.pendingRequests.forEach((controller) => controller.abort());
    this.pendingRequests.clear();
  }

  get<T = any>(options: HttpRequestConfig) {
    return this.request<T>(options);
  }

  post<T = any>(options: HttpRequestConfig) {
    return this.request<T>({
      ...options,
      method: "POST",
    });
  }

  // Add this new private helper method
  private createFormData(data: File | FormData | any): FormData {
    if (data instanceof File) {
      const form = new FormData();
      form.append("file", data);
      return form;
    }

    if (data instanceof FormData) {
      return data;
    }

    return new FormData();
  }

  upload<T = any>(options: UploadRequestConfig) {
    const {
      onProgress,
      onUploadComplete,
      onUploadError,
      data,
      ...otherOptions
    } = options;
    const formData = this.createFormData(data);

    const uploadPromise = this.request<T>({
      ...otherOptions,
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      data: formData,
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          onProgress(
            Math.round((progressEvent.loaded * 100) / progressEvent.total),
          );
        }
      },
    });

    uploadPromise.then(onUploadComplete).catch(onUploadError);
    return uploadPromise;
  }

  download(options: HttpRequestConfig) {
    const promise = this.request<Blob>({
      ...options,
      responseType: "blob",
    });

    const downloadPromise = promise.then((response) => {
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = this.getFilenameFromResponse(response) || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    });

    return Object.assign(downloadPromise, {
      cancel: () => promise.cancel(),
    });
  }

  private getFilenameFromResponse(response: HttpResponse): string {
    const disposition = response.headers["content-disposition"];
    if (disposition?.includes("attachment")) {
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(
        disposition,
      );
      if (matches?.[1]) {
        return matches[1].replace(/['"]/g, "");
      }
    }
    return "download";
  }
}
