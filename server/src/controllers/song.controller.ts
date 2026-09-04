import { Request, Response, NextFunction } from 'express';
import { SongService } from '../services/song.service';
import { ApiResponse } from '../utils/apiResponse';

export const sampleSeedTracks = [
  { title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', genre: 'Synth-pop', duration: 200 },
  { title: 'Save Your Tears', artist: 'The Weeknd', album: 'After Hours', genre: 'Synth-pop', duration: 215 },
  { title: 'Starboy', artist: 'The Weeknd', album: 'Starboy', genre: 'R&B', duration: 230 },
  { title: 'In Your Eyes', artist: 'The Weeknd', album: 'After Hours', genre: 'Synth-pop', duration: 237 },
  { title: 'Shape of You', artist: 'Ed Sheeran', album: 'Divide', genre: 'Pop', duration: 233 },
  { title: 'Perfect', artist: 'Ed Sheeran', album: 'Divide', genre: 'Pop', duration: 263 },
  { title: 'Castle on the Hill', artist: 'Ed Sheeran', album: 'Divide', genre: 'Pop', duration: 261 },
  { title: 'Bad Habits', artist: 'Ed Sheeran', album: 'Equals', genre: 'Pop', duration: 231 },
  { title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', genre: 'Rock', duration: 354 },
  { title: 'Don\'t Stop Me Now', artist: 'Queen', album: 'Jazz', genre: 'Rock', duration: 209 },
  { title: 'Radio Ga Ga', artist: 'Queen', album: 'The Works', genre: 'Rock', duration: 343 },
  { title: 'Hotel California', artist: 'Eagles', album: 'Hotel California', genre: 'Rock', duration: 391 },
  { title: 'New Kid in Town', artist: 'Eagles', album: 'Hotel California', genre: 'Rock', duration: 304 },
  { title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', genre: 'Disco-pop', duration: 203 },
  { title: 'Don\'t Start Now', artist: 'Dua Lipa', album: 'Future Nostalgia', genre: 'Disco-pop', duration: 183 },
  { title: 'Physical', artist: 'Dua Lipa', album: 'Future Nostalgia', genre: 'Disco-pop', duration: 193 },
  { title: 'Break My Heart', artist: 'Dua Lipa', album: 'Future Nostalgia', genre: 'Disco-pop', duration: 221 },
  { title: 'HUMBLE.', artist: 'Kendrick Lamar', album: 'DAMN.', genre: 'Hip-Hop', duration: 177 },
  { title: 'DNA.', artist: 'Kendrick Lamar', album: 'DAMN.', genre: 'Hip-Hop', duration: 185 },
  { title: 'Money Trees', artist: 'Kendrick Lamar', album: 'good kid, m.A.A.d city', genre: 'Hip-Hop', duration: 386 },
  { title: 'Swimming Pools', artist: 'Kendrick Lamar', album: 'good kid, m.A.A.d city', genre: 'Hip-Hop', duration: 313 },
  { title: 'Get Lucky', artist: 'Daft Punk', album: 'Random Access Memories', genre: 'Electronic', duration: 369 },
  { title: 'Instant Crush', artist: 'Daft Punk', album: 'Random Access Memories', genre: 'Electronic', duration: 337 },
  { title: 'One More Time', artist: 'Daft Punk', album: 'Discovery', genre: 'Electronic', duration: 320 },
  { title: 'Harder, Better, Faster, Stronger', artist: 'Daft Punk', album: 'Discovery', genre: 'Electronic', duration: 224 },
  { title: 'Take Five', artist: 'Dave Brubeck', album: 'Time Out', genre: 'Jazz', duration: 324 },
  { title: 'Blue in Green', artist: 'Miles Davis', album: 'Kind of Blue', genre: 'Jazz', duration: 337 },
  { title: 'So What', artist: 'Miles Davis', album: 'Kind of Blue', genre: 'Jazz', duration: 562 },
];

export class SongController {
  /**
   * GET /api/songs
   */
  static async getSongs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, genre, artist, album, page, limit } = req.query;

      const result = await SongService.getSongs({
        search: typeof search === 'string' ? search : undefined,
        genre: typeof genre === 'string' ? genre : undefined,
        artist: typeof artist === 'string' ? artist : undefined,
        album: typeof album === 'string' ? album : undefined,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 10,
      });

      ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/songs/:id
   */
  static async getSongById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const song = await SongService.getSongById(id);

      if (!song) {
        ApiResponse.error(res, `Song not found with ID ${id}`, 404);
        return;
      }

      ApiResponse.success(res, song);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/songs
   */
  static async createSong(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const song = await SongService.createSong(req.body);
      ApiResponse.created(res, song, 'Song created successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/songs/:id
   */
  static async updateSong(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const song = await SongService.updateSong(id, req.body);

      if (!song) {
        ApiResponse.error(res, `Song not found with ID ${id}`, 404);
        return;
      }

      ApiResponse.success(res, song, 'Song updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/songs/:id
   */
  static async deleteSong(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const song = await SongService.deleteSong(id);

      if (!song) {
        ApiResponse.error(res, `Song not found with ID ${id}`, 404);
        return;
      }

      ApiResponse.success(res, { id: song._id }, 'Song deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/songs/seed
   */
  static async seedSongs(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const count = await SongService.seedSongs(sampleSeedTracks);
      ApiResponse.created(res, { count }, `Successfully seeded ${count} sample tracks`);
    } catch (error) {
      next(error);
    }
  }
}
