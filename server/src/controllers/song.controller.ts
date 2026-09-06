import { Request, Response, NextFunction } from 'express';
import { SongService } from '../services/song.service';
import { ApiResponse } from '../utils/apiResponse';

export const sampleSeedTracks = [
  // Pop & Synth-pop
  { title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', genre: 'Synth-pop', duration: 200 },
  { title: 'Save Your Tears', artist: 'The Weeknd', album: 'After Hours', genre: 'Synth-pop', duration: 215 },
  { title: 'Starboy', artist: 'The Weeknd', album: 'Starboy', genre: 'R&B', duration: 230 },
  { title: 'Die For You', artist: 'The Weeknd', album: 'Starboy', genre: 'R&B', duration: 260 },
  { title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', genre: 'Pop', duration: 203 },
  { title: 'Don\'t Start Now', artist: 'Dua Lipa', album: 'Future Nostalgia', genre: 'Pop', duration: 183 },
  { title: 'Physical', artist: 'Dua Lipa', album: 'Future Nostalgia', genre: 'Pop', duration: 193 },
  { title: 'Shape of You', artist: 'Ed Sheeran', album: 'Divide', genre: 'Pop', duration: 233 },
  { title: 'Perfect', artist: 'Ed Sheeran', album: 'Divide', genre: 'Pop', duration: 263 },
  { title: 'Castle on the Hill', artist: 'Ed Sheeran', album: 'Divide', genre: 'Pop', duration: 261 },
  { title: 'Bad Habits', artist: 'Ed Sheeran', album: 'Equals', genre: 'Pop', duration: 231 },
  { title: 'Anti-Hero', artist: 'Taylor Swift', album: 'Midnights', genre: 'Pop', duration: 200 },
  { title: 'Cruel Summer', artist: 'Taylor Swift', album: 'Lover', genre: 'Pop', duration: 178 },
  { title: 'bad guy', artist: 'Billie Eilish', album: 'When We All Fall Asleep, Where Do We Go?', genre: 'Pop', duration: 194 },

  // Hip-Hop & Rap
  { title: 'HUMBLE.', artist: 'Kendrick Lamar', album: 'DAMN.', genre: 'Hip-Hop', duration: 177 },
  { title: 'DNA.', artist: 'Kendrick Lamar', album: 'DAMN.', genre: 'Hip-Hop', duration: 185 },
  { title: 'Money Trees', artist: 'Kendrick Lamar', album: 'good kid, m.A.A.d city', genre: 'Hip-Hop', duration: 386 },
  { title: 'Swimming Pools (Drank)', artist: 'Kendrick Lamar', album: 'good kid, m.A.A.d city', genre: 'Hip-Hop', duration: 313 },
  { title: 'God\'s Plan', artist: 'Drake', album: 'Scorpion', genre: 'Hip-Hop', duration: 198 },
  { title: 'Passionfruit', artist: 'Drake', album: 'More Life', genre: 'Hip-Hop', duration: 298 },
  { title: 'SICKO MODE', artist: 'Travis Scott', album: 'ASTROWORLD', genre: 'Hip-Hop', duration: 312 },
  { title: 'Middle Child', artist: 'J. Cole', album: 'The Off-Season', genre: 'Hip-Hop', duration: 213 },
  { title: 'Lose Yourself', artist: 'Eminem', album: '8 Mile Soundtrack', genre: 'Hip-Hop', duration: 326 },

  // R&B & Soul
  { title: 'Kill Bill', artist: 'SZA', album: 'SOS', genre: 'R&B', duration: 153 },
  { title: 'Snooze', artist: 'SZA', album: 'SOS', genre: 'R&B', duration: 201 },
  { title: 'Cuff It', artist: 'Beyoncé', album: 'RENAISSANCE', genre: 'R&B', duration: 225 },
  { title: 'Thinkin Bout You', artist: 'Frank Ocean', album: 'Channel Orange', genre: 'R&B', duration: 200 },
  { title: 'Best Part', artist: 'Daniel Caesar', album: 'Freudian', genre: 'R&B', duration: 210 },
  { title: 'If I Ain\'t Got You', artist: 'Alicia Keys', album: 'The Diary of Alicia Keys', genre: 'Soul', duration: 228 },

  // Afrobeats & World
  { title: 'Last Last', artist: 'Burna Boy', album: 'Love, Damini', genre: 'Afrobeats', duration: 172 },
  { title: 'City Boys', artist: 'Burna Boy', album: 'I Told Them...', genre: 'Afrobeats', duration: 153 },
  { title: 'Essence', artist: 'Wizkid', album: 'Made in Lagos', genre: 'Afrobeats', duration: 248 },
  { title: 'Free Mind', artist: 'Tems', album: 'For Broken Ears', genre: 'Afrobeats', duration: 247 },
  { title: 'Lonely At The Top', artist: 'Asake', album: 'Work of Art', genre: 'Afrobeats', duration: 157 },
  { title: 'Ethiopia', artist: 'Teddy Afro', album: 'Ethiopia', genre: 'World', duration: 345 },
  { title: 'Tikur Sew', artist: 'Teddy Afro', album: 'Tikur Sew', genre: 'World', duration: 360 },

  // Rock & Classic Rock
  { title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', genre: 'Rock', duration: 354 },
  { title: 'Don\'t Stop Me Now', artist: 'Queen', album: 'Jazz', genre: 'Rock', duration: 209 },
  { title: 'Radio Ga Ga', artist: 'Queen', album: 'The Works', genre: 'Rock', duration: 343 },
  { title: 'Hotel California', artist: 'Eagles', album: 'Hotel California', genre: 'Rock', duration: 391 },
  { title: 'Comfortably Numb', artist: 'Pink Floyd', album: 'The Wall', genre: 'Rock', duration: 382 },
  { title: 'Smells Like Teen Spirit', artist: 'Nirvana', album: 'Nevermind', genre: 'Rock', duration: 301 },
  { title: 'Yellow', artist: 'Coldplay', album: 'Parachutes', genre: 'Rock', duration: 269 },
  { title: 'Fix You', artist: 'Coldplay', album: 'X&Y', genre: 'Rock', duration: 295 },

  // Electronic & Dance
  { title: 'Get Lucky', artist: 'Daft Punk', album: 'Random Access Memories', genre: 'Electronic', duration: 369 },
  { title: 'Instant Crush', artist: 'Daft Punk', album: 'Random Access Memories', genre: 'Electronic', duration: 337 },
  { title: 'One More Time', artist: 'Daft Punk', album: 'Discovery', genre: 'Electronic', duration: 320 },
  { title: 'Harder, Better, Faster, Stronger', artist: 'Daft Punk', album: 'Discovery', genre: 'Electronic', duration: 224 },
  { title: 'Wake Me Up', artist: 'Avicii', album: 'True', genre: 'Electronic', duration: 247 },
  { title: 'Summer', artist: 'Calvin Harris', album: 'Motion', genre: 'Electronic', duration: 222 },

  // Jazz & Blues
  { title: 'So What', artist: 'Miles Davis', album: 'Kind of Blue', genre: 'Jazz', duration: 562 },
  { title: 'Blue in Green', artist: 'Miles Davis', album: 'Kind of Blue', genre: 'Jazz', duration: 337 },
  { title: 'Take Five', artist: 'Dave Brubeck', album: 'Time Out', genre: 'Jazz', duration: 324 },
  { title: 'Feeling Good', artist: 'Nina Simone', album: 'I Put a Spell on You', genre: 'Jazz', duration: 173 },
  { title: 'A Love Supreme, Pt. 1', artist: 'John Coltrane', album: 'A Love Supreme', genre: 'Jazz', duration: 462 },

  // Reggae
  { title: 'Three Little Birds', artist: 'Bob Marley & The Wailers', album: 'Exodus', genre: 'Reggae', duration: 180 },
  { title: 'Could You Be Loved', artist: 'Bob Marley & The Wailers', album: 'Uprising', genre: 'Reggae', duration: 237 },
  { title: 'Is This Love', artist: 'Bob Marley & The Wailers', album: 'Kaya', genre: 'Reggae', duration: 232 },
  { title: 'Toast', artist: 'Koffee', album: 'Rapture', genre: 'Reggae', duration: 191 },
];

export class SongController {
  /**
   * GET /api/songs
   */
  static async getSongs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, genre, artist, album, favorite, page, limit } = req.query;

      const isFav =
        favorite === 'true' || favorite === '1'
          ? true
          : favorite === 'false' || favorite === '0'
          ? false
          : undefined;

      const result = await SongService.getSongs({
        search: typeof search === 'string' ? search : undefined,
        genre: typeof genre === 'string' ? genre : undefined,
        artist: typeof artist === 'string' ? artist : undefined,
        album: typeof album === 'string' ? album : undefined,
        favorite: isFav,
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
   * PATCH /api/songs/:id/favorite
   */
  static async toggleFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const song = await SongService.toggleFavorite(id);

      if (!song) {
        ApiResponse.error(res, `Song not found with ID ${id}`, 404);
        return;
      }

      ApiResponse.success(
        res,
        song,
        song.isFavorite ? 'Added to favorites' : 'Removed from favorites'
      );
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
