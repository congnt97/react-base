export type ResponseCommon<T = unknown> = {
  success?: boolean;
  message?: string;
  data?: T;
  result?: T;
};
