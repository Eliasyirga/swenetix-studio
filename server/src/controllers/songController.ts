import { Request, Response, NextFunction } from 'express';
import mongoose from 'express';
import { Song, ISong } from '../models/Song';

// Seed sample data list
export const sampleSongs = [
  { title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', genre: 'Synth-pop', duration: 200 },
  { title: 'Save Your Tears', artist: 'The Weeknd', album: 'After Hours', genre: 'Synth-pop', duration: 215 },
  { title: 'Starboy', artist: 'The Weeknd', album: 'Starboy', genre: 'R&B', duration: 230 },
  { title: 'Shape of You', artist: 'Ed Sheeran', album: '÷ (Divide)', genre: 'Pop', duration: 233 },
  { title: 'Perfect', artist: 'Ed Sheeran', album: '÷ (Divide)', genre: 'Pop', duration: 263 },
  { title: 'Bad Habits', artist: 'Ed Sheeran', album: '= (Equals)', genre: 'Pop', duration: 231 },
  { title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', genre: 'Rock', duration: 354 },
  { title: 'Don\'t Stop Me Now', artist: 'Queen', album: 'Jazz', genre: 'Rock', duration: 209 },
  { title: 'Hotel California', artist: 'Eagles', album: 'Hotel California', genre: 'Rock', duration: 391 },
  { title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', genre: 'Disco-pop', duration: 203 },
  { title: 'Don\'t Start Now', artist: 'Dua Lipa', album: 'Future Nostalgia', genre: 'Disco-pop', duration: 183 },
  { title: 'HUMBLE.', artist: 'Kendrick Lamar', album: 'DAMN.', genre: 'Hip-Hop', duration: 177 },
  { title: 'DNA.', artist: 'Kendrick Lamar', album: 'DAMN.', genre: 'Hip-Hop', duration: 185 },
  { title: 'Money Trees', artist: 'Kendrick Lamar', album: 'good kid, m.A.A.d city', genre: 'Hip-Hop', duration: 386 },
  { title: 'Get Lucky', artist: 'Daft Punk', album: 'Random Access Memories', genre: 'Electronic', duration: 369 },
  { title: 'Instant Crush', artist: 'Daft Punk', album: 'Random Access Memories', genre: 'Electronic', duration: 337 },
  { title: 'One More Time', artist: 'Daft Punk', album: 'Discovery', genre: 'Electronic', duration: 320 },
];

/**
 * @desc Get all songs with optional search & genre filters
 * @route GET /api/songs
 */
export const getSongs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { genre, search } = req.query;

    const query: Record<string, unknown> = {};

    if (genre && typeof genre === 'string' && genre.trim() !== '' && genre.toLowerCase() !== 'all') {
      query.genre = { $regex: new RegExp(`^${genre.trim()}$`, 'i') };
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { artist: searchRegex },
        { album: searchRegex },
        { genre: searchRegex },
      ];
    }

    const songs = await Song.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: songs.length,
      data: songs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get single song by ID
 * @route GET /api/songs/:id
 */
export const getSongById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const song = await Song.findById(id);

    if (!song) {
      res.status(404).json({
        success: false,
        message: `Song not found with ID ${id}`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: song,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Create new song
 * @route POST /api/songs
 */
export const createSong = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, artist, album, genre, duration } = req.body;

    const song = await Song.create({
      title,
      artist,
      album,
      genre,
      duration: duration || 210,
    });

    res.status(201).json({
      success: true,
      message: 'Song created successfully',
      data: song,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update song by ID
 * @route PUT /api/songs/:id
 */
export const updateSong = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const song = await Song.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!song) {
      res.status(404).json({
        success: false,
        message: `Song not found with ID ${id}`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Song updated successfully',
      data: song,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete song by ID
 * @route DELETE /api/songs/:id
 */
export const deleteSong = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const song = await Song.findByIdAndDelete(id);

    if (!song) {
      res.status(404).json({
        success: false,
        message: `Song not found with ID ${id}`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Song deleted successfully',
      data: { id: song._id },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get statistical aggregation using MongoDB $facet pipeline
 * @route GET /api/songs/stats
 */
export const getSongStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const aggregationResult = await Song.aggregate([
      {
        $facet: {
          // 1. Overall counts: Total songs, unique artists, unique albums, unique genres
          overallTotals: [
            {
              $group: {
                _id: null,
                totalSongs: { $sum: 1 },
                uniqueArtists: { $addToSet: '$artist' },
                uniqueAlbums: { $addToSet: '$album' },
                uniqueGenres: { $addToSet: '$genre' },
              },
            },
            {
              $project: {
                _id: 0,
                totalSongs: 1,
                totalArtists: { $size: '$uniqueArtists' },
                totalAlbums: { $size: '$uniqueAlbums' },
                totalGenres: { $size: '$uniqueGenres' },
              },
            },
          ],

          // 2. Count of songs per genre
          songsPerGenre: [
            {
              $group: {
                _id: '$genre',
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1, _id: 1 } },
            {
              $project: {
                _id: 0,
                genre: '$_id',
                count: 1,
              },
            },
          ],

          // 3. Count of songs and distinct albums per artist
          songsAndAlbumsPerArtist: [
            {
              $group: {
                _id: '$artist',
                totalSongs: { $sum: 1 },
                albums: { $addToSet: '$album' },
              },
            },
            {
              $project: {
                _id: 0,
                artist: '$_id',
                totalSongs: 1,
                totalAlbums: { $size: '$albums' },
              },
            },
            { $sort: { totalSongs: -1, artist: 1 } },
          ],

          // 4. Count of songs per album
          songsPerAlbum: [
            {
              $group: {
                _id: { album: '$album', artist: '$artist' },
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                album: '$_id.album',
                artist: '$_id.artist',
                count: 1,
              },
            },
            { $sort: { count: -1, album: 1 } },
          ],
        },
      },
    ]);

    const result = aggregationResult[0] || {};

    const overall = result.overallTotals?.[0] || {
      totalSongs: 0,
      totalArtists: 0,
      totalAlbums: 0,
      totalGenres: 0,
    };

    const statsPayload = {
      overall,
      genres: result.songsPerGenre || [],
      artists: result.songsAndAlbumsPerArtist || [],
      albums: result.songsPerAlbum || [],
    };

    res.status(200).json({
      success: true,
      data: statsPayload,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Quick seed sample database records
 * @route POST /api/songs/seed
 */
export const seedSongs = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await Song.deleteMany({});
    const inserted = await Song.insertMany(sampleSongs);

    res.status(201).json({
      success: true,
      message: `Database successfully seeded with ${inserted.length} songs`,
      data: inserted,
    });
  } catch (error) {
    next(error);
  }
};
