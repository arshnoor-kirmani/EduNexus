export type EmailSenderConfigResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};
