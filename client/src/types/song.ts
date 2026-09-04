export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSongDto {
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration?: number;
}

export interface UpdateSongDto {
  id: string;
  data: Partial<CreateSongDto>;
}

export interface SongQueryFilters {
  search?: string;
  genre?: string;
  artist?: string;
  album?: string;
  page?: number;
  limit?: number;
}

export type SongQueryFilter = SongQueryFilters;

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface FilterOptions {
  genres: string[];
  artists: string[];
  albums: string[];
}

export interface PaginatedSongsResponse {
  songs: Song[];
  pagination: PaginationMeta;
  filterOptions: FilterOptions;
}
