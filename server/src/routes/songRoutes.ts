import { Router } from 'express';
import {
  getSongs,
  getSongById,
  createSong,
  updateSong,
  deleteSong,
  getSongStats,
  seedSongs,
} from '../controllers/songController';
import { validate, createSongSchema, updateSongSchema } from '../middleware/validate';

const router = Router();

// Stats aggregation endpoint
router.get('/stats', getSongStats);

// Quick seed sample data endpoint
router.post('/seed', seedSongs);

// Main collection endpoints
router
  .route('/')
  .get(getSongs)
  .post(validate(createSongSchema), createSong);

// Individual song endpoints
router
  .route('/:id')
  .get(getSongById)
  .put(validate(updateSongSchema), updateSong)
  .delete(deleteSong);

export default router;
