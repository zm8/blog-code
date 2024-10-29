import { InternalAxiosRequestConfig } from "axios";
import { Http } from "../http";

interface ErrorResponse extends Error {
  code: string;
  config: InternalAxiosRequestConfig;
}

export const http = new Http({
  config: {
    baseURL: "http://localhost:3000",
    timeout: 1 * 1000,
    headers: {
      "Content-Type": "application/json",
    },
    showError: true,
  },
  interceptors: {
    response: {
      onFulfilled: (response) => {
        // 这里可以根据实际接口返回格式调整
        if (response.data.code === 200) {
          return response.data.data;
        }
        // 统一处理业务错误
        const error = new Error(
          response.data.message || "处理失败",
        ) as ErrorResponse;
        error.code = response.data.code;
        error.config = response.config;
        return Promise.reject(error);
      },
    },
  },
});
