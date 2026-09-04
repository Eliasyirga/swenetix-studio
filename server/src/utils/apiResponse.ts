import { Response } from 'express';

export interface ApiResponseData<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

export class ApiResponse {
  static success<T>(res: Response, data: T, message?: string, statusCode = 200): Response {
    const response: ApiResponseData<T> = {
      success: true,
      ...(message ? { message } : {}),
      data,
    };
    return res.status(statusCode).json(response);
  }

  static created<T>(res: Response, data: T, message = 'Resource created successfully'): Response {
    return this.success(res, data, message, 201);
  }

  static error(res: Response, message = 'Internal Server Error', statusCode = 500, errors?: Array<{ field: string; message: string }>): Response {
    const response: ApiResponseData = {
      success: false,
      message,
      ...(errors ? { errors } : {}),
    };
    return res.status(statusCode).json(response);
  }
}
