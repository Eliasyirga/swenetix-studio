import { Song, ISongDocument } from '../models/song.model';
import { ISong, SongQueryFilters, PaginatedSongsResponse } from '../types/song.types';

export class SongService {
  /**
   * List songs with flexible search, multi-attribute filtering, and pagination
   */
  static async getSongs(filters: SongQueryFilters = {}): Promise<PaginatedSongsResponse> {
    const { search, genre, artist, album, page = 1, limit = 10 } = filters;

    const query: Record<string, unknown> = {};

    // 1. Text / Keyword Search across Title, Artist, Album, Genre
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { artist: searchRegex },
        { album: searchRegex },
        { genre: searchRegex },
      ];
    }

    // 2. Strict / Direct Filters
    if (genre && genre.trim() !== '' && genre.toLowerCase() !== 'all') {
      query.genre = { $regex: new RegExp(`^${genre.trim()}$`, 'i') };
    }

    if (artist && artist.trim() !== '' && artist.toLowerCase() !== 'all') {
      query.artist = { $regex: new RegExp(`^${artist.trim()}$`, 'i') };
    }

    if (album && album.trim() !== '' && album.toLowerCase() !== 'all') {
      query.album = { $regex: new RegExp(`^${album.trim()}$`, 'i') };
    }

    const currentPage = Math.max(1, Number(page));
    const pageSize = Math.min(100, Math.max(1, Number(limit)));
    const skip = (currentPage - 1) * pageSize;

    const [total, songs, distinctGenres, distinctArtists, distinctAlbums] = await Promise.all([
      Song.countDocuments(query),
      Song.find(query).sort({ createdAt: -1 }).skip(skip).limit(pageSize),
      Song.distinct('genre'),
      Song.distinct('artist'),
      Song.distinct('album'),
    ]);

    const totalPages = Math.ceil(total / pageSize) || 1;

    return {
      songs: songs as unknown as ISong[],
      pagination: {
        total,
        page: currentPage,
        limit: pageSize,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
      },
      filterOptions: {
        genres: distinctGenres.sort(),
        artists: distinctArtists.sort(),
        albums: distinctAlbums.sort(),
      },
    };
  }

  /**
   * Get single song by ID
   */
  static async getSongById(id: string): Promise<ISongDocument | null> {
    return Song.findById(id);
  }

  /**
   * Create new song
   */
  static async createSong(data: Partial<ISong>): Promise<ISongDocument> {
    return Song.create(data);
  }

  /**
   * Update existing song
   */
  static async updateSong(id: string, data: Partial<ISong>): Promise<ISongDocument | null> {
    return Song.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Delete song by ID
   */
  static async deleteSong(id: string): Promise<ISongDocument | null> {
    return Song.findByIdAndDelete(id);
  }

  /**
   * Seed sample dataset
   */
  static async seedSongs(sampleData: Partial<ISong>[]): Promise<number> {
    await Song.deleteMany({});
    const result = await Song.insertMany(sampleData);
    return result.length;
  }
}
