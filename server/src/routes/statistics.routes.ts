import { Router } from 'express';
import { StatisticsController } from '../controllers/statistics.controller';

const router = Router();

// GET /api/statistics
router.get('/', StatisticsController.getStatistics);

export default router;
