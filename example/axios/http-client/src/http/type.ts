import { AxiosResponse } from "axios";

export type ApiResponse<T> = AxiosResponse<{
  returnCode: string;
  data: [T];
  msg: string;
}>;
export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}
