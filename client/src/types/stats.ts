export interface OverallStats {
  totalSongs: number;
  totalArtists: number;
  totalAlbums: number;
  totalGenres: number;
}

export interface GenreStat {
  genre: string;
  count: number;
}

export interface ArtistStat {
  artist: string;
  totalSongs: number;
  totalAlbums: number;
}

export interface AlbumStat {
  album: string;
  artist: string;
  count: number;
}

export interface StatsPayload {
  overall: OverallStats;
  genres: GenreStat[];
  artists: ArtistStat[];
  albums: AlbumStat[];
}
