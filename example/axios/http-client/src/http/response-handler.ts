import { AxiosResponse } from "axios";
import { ResponseHandler as IResponseHandler } from "../shared/http-client/types";
import { ApiError } from "./api-error";
import { ApiResponse } from "./types";

export class ResponseHandler<T> implements IResponseHandler<T> {
  handle(response: AxiosResponse<ApiResponse<T>>): Promise<T> {
    if (response.data.returnCode === "00000") {
      return Promise.resolve(response.data.data[0]);
    }
    return Promise.reject(new ApiError(response.data.msg));
  }
}
