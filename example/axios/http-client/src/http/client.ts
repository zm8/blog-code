import { BaseHttp } from "../shared/http-client";
import { setupResponseInterceptor } from "./interceptors";

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
    });
  }
  protected setupInterceptors(): void {
    this.instance.interceptors.response.use(setupResponseInterceptor);
  }
}

export const http = new Http();
