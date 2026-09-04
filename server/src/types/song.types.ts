export interface ISong {
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SongQueryFilters {
  search?: string;
  genre?: string;
  artist?: string;
  album?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedSongsResponse {
  songs: ISong[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filterOptions: {
    genres: string[];
    artists: string[];
    albums: string[];
  };
}
