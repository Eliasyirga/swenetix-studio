import { Song } from '../models/song.model';
import { StatisticsData } from '../types/statistics.types';

export class StatisticsService {
  /**
   * Execute single-stage multi-facet MongoDB aggregation pipeline
   */
  static async getStatistics(): Promise<StatisticsData> {
    const pipelineResult = await Song.aggregate([
      {
        $facet: {
          // 1. Overall counts: Total songs, unique artists, unique albums, unique genres
          overview: [
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

          // 2. Count of songs grouped by genre
          songsByGenre: [
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
          artists: [
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
          albums: [
            {
              $group: {
                _id: { album: '$album', artist: '$artist' },
                totalSongs: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                album: '$_id.album',
                artist: '$_id.artist',
                totalSongs: 1,
              },
            },
            { $sort: { totalSongs: -1, album: 1 } },
          ],
        },
      },
    ]);

    const result = pipelineResult[0] || {};

    const overview = result.overview?.[0] || {
      totalSongs: 0,
      totalArtists: 0,
      totalAlbums: 0,
      totalGenres: 0,
    };

    const songsByGenre = result.songsByGenre || [];
    const artists = result.artists || [];
    const albums = result.albums || [];

    // Calculate percentage for genres
    const totalSongs = overview.totalSongs;
    const formattedGenres = songsByGenre.map((g: { genre: string; count: number }) => ({
      genre: g.genre,
      count: g.count,
      percentage: totalSongs > 0 ? Math.round((g.count / totalSongs) * 100) : 0,
    }));

    // Calculate curated highlights
    const mostProlificArtist =
      artists.length > 0
        ? { artist: artists[0].artist, songCount: artists[0].totalSongs }
        : null;

    const mostCommonGenre =
      songsByGenre.length > 0
        ? { genre: songsByGenre[0].genre, songCount: songsByGenre[0].count }
        : null;

    const largestAlbum =
      albums.length > 0
        ? { album: albums[0].album, artist: albums[0].artist, songCount: albums[0].totalSongs }
        : null;

    return {
      overview,
      songsByGenre: formattedGenres,
      artists,
      albums,
      highlights: {
        mostProlificArtist,
        mostCommonGenre,
        largestAlbum,
      },
    };
  }
}
