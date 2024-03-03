export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export type $metadata = {
  httpStatusCode: number;
  requestId: string;
  attempts: number;
  totalRetryDelay: number;
};
