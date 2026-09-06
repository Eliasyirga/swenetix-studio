import { Song } from '../models/song.model';
import { StatisticsData, DurationMetrics } from '../types/statistics.types';

function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export class StatisticsService {
  /**
   * Execute single-stage multi-facet MongoDB aggregation pipeline
   */
  static async getStatistics(): Promise<StatisticsData> {
    const pipelineResult = await Song.aggregate([
      {
        $facet: {
          // 1. Overall counts: Total songs, unique artists, unique albums, unique genres, favorites
          overview: [
            {
              $group: {
                _id: null,
                totalSongs: { $sum: 1 },
                uniqueArtists: { $addToSet: '$artist' },
                uniqueAlbums: { $addToSet: '$album' },
                uniqueGenres: { $addToSet: '$genre' },
                totalFavorites: {
                  $sum: { $cond: [{ $eq: ['$isFavorite', true] }, 1, 0] },
                },
                totalDurationSeconds: { $sum: { $ifNull: ['$duration', 210] } },
                avgDurationSeconds: { $avg: { $ifNull: ['$duration', 210] } },
              },
            },
            {
              $project: {
                _id: 0,
                totalSongs: 1,
                totalArtists: { $size: '$uniqueArtists' },
                totalAlbums: { $size: '$uniqueAlbums' },
                totalGenres: { $size: '$uniqueGenres' },
                totalFavorites: 1,
                totalDurationSeconds: 1,
                avgDurationSeconds: 1,
              },
            },
          ],

          // 2. Count of songs grouped by genre
          songsByGenre: [
            {
              $group: {
                _id: '$genre',
                count: { $sum: 1 },
                favoriteCount: {
                  $sum: { $cond: [{ $eq: ['$isFavorite', true] }, 1, 0] },
                },
              },
            },
            { $sort: { count: -1, _id: 1 } },
            {
              $project: {
                _id: 0,
                genre: '$_id',
                count: 1,
                favoriteCount: 1,
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

          // 5. Longest track
          longestTrack: [
            { $match: { duration: { $gt: 0 } } },
            { $sort: { duration: -1 } },
            { $limit: 1 },
            {
              $project: {
                _id: 0,
                title: 1,
                artist: 1,
                duration: 1,
              },
            },
          ],

          // 6. Shortest track
          shortestTrack: [
            { $match: { duration: { $gt: 0 } } },
            { $sort: { duration: 1 } },
            { $limit: 1 },
            {
              $project: {
                _id: 0,
                title: 1,
                artist: 1,
                duration: 1,
              },
            },
          ],
        },
      },
    ]);

    const result = pipelineResult[0] || {};

    const rawOverview = result.overview?.[0] || {
      totalSongs: 0,
      totalArtists: 0,
      totalAlbums: 0,
      totalGenres: 0,
      totalFavorites: 0,
      totalDurationSeconds: 0,
      avgDurationSeconds: 0,
    };

    const totalSongs = rawOverview.totalSongs || 0;
    const totalFavorites = rawOverview.totalFavorites || 0;
    const favoritePercentage = totalSongs > 0 ? Math.round((totalFavorites / totalSongs) * 100) : 0;

    const overview = {
      totalSongs,
      totalArtists: rawOverview.totalArtists || 0,
      totalAlbums: rawOverview.totalAlbums || 0,
      totalGenres: rawOverview.totalGenres || 0,
      totalFavorites,
      favoritePercentage,
    };

    const songsByGenre = result.songsByGenre || [];
    const artists = result.artists || [];
    const albums = result.albums || [];

    // Calculate percentage for genres
    const formattedGenres = songsByGenre.map((g: { genre: string; count: number }) => ({
      genre: g.genre,
      count: g.count,
      percentage: totalSongs > 0 ? Math.round((g.count / totalSongs) * 100) : 0,
    }));

    // Duration Metrics
    const avgDuration = Math.round(rawOverview.avgDurationSeconds || 0);
    const totalHours = Number(((rawOverview.totalDurationSeconds || 0) / 3600).toFixed(1));

    const longest = result.longestTrack?.[0] || null;
    const shortest = result.shortestTrack?.[0] || null;

    const durationMetrics: DurationMetrics = {
      averageDuration: avgDuration,
      formattedAverage: formatDuration(avgDuration),
      totalCatalogHours: totalHours,
      longestSong: longest
        ? {
            title: longest.title,
            artist: longest.artist,
            duration: longest.duration,
            formatted: formatDuration(longest.duration),
          }
        : null,
      shortestSong: shortest
        ? {
            title: shortest.title,
            artist: shortest.artist,
            duration: shortest.duration,
            formatted: formatDuration(shortest.duration),
          }
        : null,
    };

    // Curated highlights
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

    // Find genre with highest favoriteCount
    const genresWithFavs = [...songsByGenre].sort((a, b) => (b.favoriteCount || 0) - (a.favoriteCount || 0));
    const mostFavoritedGenre =
      genresWithFavs.length > 0 && genresWithFavs[0].favoriteCount > 0
        ? { genre: genresWithFavs[0].genre, count: genresWithFavs[0].favoriteCount }
        : null;

    return {
      overview,
      songsByGenre: formattedGenres,
      artists,
      albums,
      durationMetrics,
      highlights: {
        mostProlificArtist,
        mostCommonGenre,
        largestAlbum,
        mostFavoritedGenre,
      },
    };
  }
}

