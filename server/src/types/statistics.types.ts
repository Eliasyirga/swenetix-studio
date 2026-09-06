export interface StatisticsOverview {
  totalSongs: number;
  totalArtists: number;
  totalAlbums: number;
  totalGenres: number;
  totalFavorites?: number;
  favoritePercentage?: number;
}

export interface SongsByGenreItem {
  genre: string;
  count: number;
  percentage?: number;
}

export interface ArtistStatItem {
  artist: string;
  totalSongs: number;
  totalAlbums: number;
}

export interface AlbumStatItem {
  album: string;
  artist: string;
  totalSongs: number;
}

export interface DurationMetrics {
  averageDuration: number;
  formattedAverage: string;
  totalCatalogHours: number;
  longestSong: {
    title: string;
    artist: string;
    duration: number;
    formatted: string;
  } | null;
  shortestSong: {
    title: string;
    artist: string;
    duration: number;
    formatted: string;
  } | null;
}

export interface StatisticsHighlights {
  mostProlificArtist: { artist: string; songCount: number } | null;
  mostCommonGenre: { genre: string; songCount: number } | null;
  largestAlbum: { album: string; artist: string; songCount: number } | null;
  mostFavoritedGenre?: { genre: string; count: number } | null;
}

export interface StatisticsData {
  overview: StatisticsOverview;
  songsByGenre: SongsByGenreItem[];
  artists: ArtistStatItem[];
  albums: AlbumStatItem[];
  durationMetrics?: DurationMetrics;
  highlights: StatisticsHighlights;
}
