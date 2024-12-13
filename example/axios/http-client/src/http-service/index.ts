import { BaseHttp } from "../http-core/core/base-http";
import { ResponseHandler } from "./handlers/response-handler";

export class Http extends BaseHttp {
  constructor() {
    super({
      config: {
        baseURL: "http://localhost:3000",
        timeout: 60 * 1000,
        headers: {
          "Content-Type": "application/json",
        },
        showError: true,
      },
      responseHandler: new ResponseHandler(),
    });
  }
}

export const http = new Http();
