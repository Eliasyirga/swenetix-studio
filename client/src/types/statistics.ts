export interface StatisticsOverview {
  totalSongs: number;
  totalArtists: number;
  totalAlbums: number;
  totalGenres: number;
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

export interface StatisticsHighlights {
  mostProlificArtist: { artist: string; songCount: number } | null;
  mostCommonGenre: { genre: string; songCount: number } | null;
  largestAlbum: { album: string; artist: string; songCount: number } | null;
}

export interface StatisticsData {
  overview: StatisticsOverview;
  songsByGenre: SongsByGenreItem[];
  artists: ArtistStatItem[];
  albums: AlbumStatItem[];
  highlights: StatisticsHighlights;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: Array<{ field: string; message: string }>;
}
