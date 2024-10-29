import axios, { AxiosInstance } from "axios";
import {
  CancellablePromise,
  HttpError,
  HttpParams,
  HttpResponse,
  HttpRequestConfig,
  UploadRequestConfig,
} from "./type";

export class Http {
  private instance: AxiosInstance;
  private pendingRequests: Map<number, AbortController> = new Map();
  private interceptors: HttpParams["interceptors"];
  private requestId = 0;

  constructor(params: HttpParams) {
    this.instance = axios.create(params.config);
    this.interceptors = params.interceptors;
    this.setupInterceptors();
  }

  // 设置拦截器
  private setupInterceptors(): void {
    this.instance.interceptors.request.use(
      (config) => {
        // 处理 POST 请求参数
        if (config.method?.toUpperCase() !== "GET") {
          config.data = config.params;
          delete config.params;
        }
        return this.interceptors?.request?.onFulfilled?.(config) || config;
      },
      (error: HttpError) => {
        return Promise.reject(error);
      },
    );

    this.instance.interceptors.response.use(
      (response) => {
        // 下载文件会走到这里, 上传文件的返回数据和普通的post一样
        if (["blob"].includes(response.config.responseType || "")) {
          return response;
        }
        const res = this.interceptors?.response?.onFulfilled?.(response);
        if (res) return res;
        return response.data;
      },
      (error: HttpError) => {
        switch (error.code) {
          case "ERR_NETWORK":
            console.log("网络异常", error.message);
            break;
          case "ECONNABORTED":
            console.log("请求超时", error.message);
            break;
          case "ERR_CANCELED":
            console.log("取消请求", error.message);
            break;
          case "ERR_BAD_RESPONSE": // 500
            console.log("服务器错误", error.status, error.message);
            break;
          case "ERR_BAD_REQUEST": // 404
            console.log("请求错误", error.status, error.message);
            break;
          default:
            break;
        }
        if (error.code !== "ERR_CANCELED" && error.config?.showError) {
          console.log("===弹层显示错误信息===");
        }
        return Promise.reject(error);
      },
    );
  }

  // 统一请求方法
  request<T = any>(
    config: HttpRequestConfig,
  ): CancellablePromise<HttpResponse<T>> {
    const controller = new AbortController();
    const requestId = this.requestId++;
    this.pendingRequests.set(requestId, controller);
    const promise = this.instance
      .request({
        ...config,
        signal: controller.signal,
      })
      .finally(() => {
        // 请求完成后自动清理
        this.pendingRequests.delete(requestId);
      });

    // 使用 Object.assign 来添加 cancel 方法
    return Object.assign(promise, {
      cancel: () => {
        controller.abort();
      },
    });
  }

  // 取消所有请求
  cancelAllRequests(): void {
    this.pendingRequests.forEach((controller) => {
      controller.abort();
    });
    this.pendingRequests.clear();
  }

  // GET 请求
  get<T = any>(options: HttpRequestConfig) {
    return this.request<T>(options);
  }

  // POST 请求
  post<T = any>(options: HttpRequestConfig) {
    return this.request<T>({
      ...options,
      method: "POST",
    });
  }

  // 上传
  upload<T = any>(options: UploadRequestConfig) {
    const { onProgress, ...otherOptions } = options;
    return this.request<T>({
      ...otherOptions,
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onProgress(percentage);
        }
      },
    });
  }

  // 下载
  download(options: HttpRequestConfig) {
    const promise = this.request<Blob>({
      ...options,
      responseType: "blob",
    });

    // 创建一个新的 Promise 来处理下载逻辑
    const downloadPromise = promise.then((response) => {
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = this.getFilenameFromResponse(response) || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    });

    // 将 cancel 方法转发给原始的 promise
    return Object.assign(downloadPromise, {
      cancel: () => {
        promise.cancel();
      },
    });
  }

  private getFilenameFromResponse(response: HttpResponse): string {
    const disposition = response.headers["content-disposition"];
    if (disposition && disposition.indexOf("attachment") !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) {
        return matches[1].replace(/['"]/g, "");
      }
    }
    return "download";
  }
}
