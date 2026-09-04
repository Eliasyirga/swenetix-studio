import { Request, Response, NextFunction } from 'express';
import { StatisticsService } from '../services/statistics.service';
import { ApiResponse } from '../utils/apiResponse';

export class StatisticsController {
  /**
   * GET /api/statistics
   */
  static async getStatistics(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await StatisticsService.getStatistics();
      ApiResponse.success(res, stats, 'Statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}
