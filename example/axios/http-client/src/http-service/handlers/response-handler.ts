import { AxiosResponse } from "axios";
import { ResponseHandler as IResponseHandler } from "../../http-core/core/types";
import { ApiError } from "../errors/api-error";
import { ApiResponse } from "../interface";
import { ApiCodes } from "../contants";

export class ResponseHandler<T> implements IResponseHandler<T> {
  handle(response: AxiosResponse<ApiResponse<T>>): Promise<T> {
    if (response.data.returnCode === ApiCodes.SUCCESS) {
      return Promise.resolve(response.data.data[0]);
    }
    return Promise.reject(new ApiError(response.data.msg));
  }
}
