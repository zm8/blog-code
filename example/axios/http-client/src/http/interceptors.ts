import { ApiResponse, ApiError } from "./type";

export const setupResponseInterceptor = <T>(response: ApiResponse<T>) => {
  if (response.data.returnCode === "00000") {
    return response.data.data[0];
  }
  const error = new ApiError(response.data.msg);
  return Promise.reject(error);
};
