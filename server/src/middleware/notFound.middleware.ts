import { Request, Response } from 'express';
import { ApiResponse } from '../utils/apiResponse';

export const notFoundHandler = (req: Request, res: Response): void => {
  ApiResponse.error(res, `Endpoint not found: ${req.method} ${req.originalUrl}`, 404);
};
