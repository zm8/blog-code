export type ApiResponse<T> = {
  returnCode: string;
  data: [T];
  msg: string;
};
