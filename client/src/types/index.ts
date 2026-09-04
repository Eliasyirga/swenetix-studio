export * from './song';
export * from './stats';
export * from './filter';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  count?: number;
  data: T;
  errors?: Array<{ field: string; message: string }>;
}
