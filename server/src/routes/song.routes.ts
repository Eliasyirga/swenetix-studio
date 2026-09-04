import { Router } from 'express';
import { SongController } from '../controllers/song.controller';
import { validateRequest, createSongSchema, updateSongSchema } from '../middleware/validate.middleware';

const router = Router();

// Quick Seed sample songs
router.post('/seed', SongController.seedSongs);

// Song collection endpoints
router
  .route('/')
  .get(SongController.getSongs)
  .post(validateRequest(createSongSchema), SongController.createSong);

// Individual song endpoints
router
  .route('/:id')
  .get(SongController.getSongById)
  .put(validateRequest(updateSongSchema), SongController.updateSong)
  .delete(SongController.deleteSong);

export default router;
