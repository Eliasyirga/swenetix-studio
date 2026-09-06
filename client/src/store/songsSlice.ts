import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Song,
  CreateSongDto,
  UpdateSongDto,
  SongQueryFilters,
  PaginationMeta,
  FilterOptions,
  PaginatedSongsResponse,
} from '../types/song';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface SongsState {
  items: Song[];
  pagination: PaginationMeta;
  filterOptions: FilterOptions;
  filters: SongQueryFilters;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  selectedSong: Song | null;
  isFormModalOpen: boolean;
  deletingSong: Song | null;
  toast: ToastMessage | null;
}

const initialState: SongsState = {
  items: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  },
  filterOptions: {
    genres: [],
    artists: [],
    albums: [],
  },
  filters: {
    search: '',
    genre: 'All',
    artist: 'All',
    album: 'All',
    page: 1,
    limit: 10,
  },
  loading: false,
  actionLoading: false,
  error: null,
  selectedSong: null,
  isFormModalOpen: false,
  deletingSong: null,
  toast: null,
};

const songsSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {
    // Fetch Songs
    fetchSongsRequest: (state, action: PayloadAction<SongQueryFilters | undefined>) => {
      state.loading = true;
      state.error = null;
      if (action.payload) {
        state.filters = { ...state.filters, ...action.payload };
      }
    },
    fetchSongsSuccess: (state, action: PayloadAction<PaginatedSongsResponse>) => {
      state.loading = false;
      state.items = action.payload.songs;
      state.pagination = action.payload.pagination;
      state.filterOptions = action.payload.filterOptions;
    },
    fetchSongsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Filter updates
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
      state.filters.page = 1;
    },
    setGenreFilter: (state, action: PayloadAction<string>) => {
      state.filters.genre = action.payload;
      state.filters.page = 1;
    },
    setArtistFilter: (state, action: PayloadAction<string>) => {
      state.filters.artist = action.payload;
      state.filters.page = 1;
    },
    setAlbumFilter: (state, action: PayloadAction<string>) => {
      state.filters.album = action.payload;
      state.filters.page = 1;
    },
    setFavoriteFilter: (state, action: PayloadAction<boolean | undefined>) => {
      state.filters.favorite = action.payload;
      state.filters.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
    },
    resetFilters: (state) => {
      state.filters = {
        search: '',
        genre: 'All',
        artist: 'All',
        album: 'All',
        favorite: undefined,
        page: 1,
        limit: 10,
      };
    },

    // Toggle Favorite
    toggleFavoriteRequest: (state, action: PayloadAction<string>) => {
      // Optimistic update
      const index = state.items.findIndex((s) => s.id === action.payload);
      if (index !== -1) {
        state.items[index].isFavorite = !state.items[index].isFavorite;
      }
    },
    toggleFavoriteSuccess: (state, action: PayloadAction<Song>) => {
      const index = state.items.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    toggleFavoriteFailure: (state, action: PayloadAction<{ id: string; error: string }>) => {
      // Revert optimistic update on error
      const index = state.items.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.items[index].isFavorite = !state.items[index].isFavorite;
      }
      state.error = action.payload.error;
    },

    // Create Song
    createSongRequest: (state, _action: PayloadAction<CreateSongDto>) => {
      state.actionLoading = true;
      state.error = null;
    },
    createSongSuccess: (state, action: PayloadAction<Song>) => {
      state.actionLoading = false;
      state.isFormModalOpen = false;
      state.selectedSong = null;
      state.items.unshift(action.payload);
      state.pagination.total += 1;
    },
    createSongFailure: (state, action: PayloadAction<string>) => {
      state.actionLoading = false;
      state.error = action.payload;
    },

    // Update Song
    updateSongRequest: (state, _action: PayloadAction<UpdateSongDto>) => {
      state.actionLoading = true;
      state.error = null;
    },
    updateSongSuccess: (state, action: PayloadAction<Song>) => {
      state.actionLoading = false;
      state.isFormModalOpen = false;
      state.selectedSong = null;
      const index = state.items.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    updateSongFailure: (state, action: PayloadAction<string>) => {
      state.actionLoading = false;
      state.error = action.payload;
    },

    // Delete Song
    deleteSongRequest: (state, _action: PayloadAction<string>) => {
      state.actionLoading = true;
      state.error = null;
    },
    deleteSongSuccess: (state, action: PayloadAction<string>) => {
      state.actionLoading = false;
      state.deletingSong = null;
      state.items = state.items.filter((s) => s.id !== action.payload);
      state.pagination.total = Math.max(0, state.pagination.total - 1);
    },
    deleteSongFailure: (state, action: PayloadAction<string>) => {
      state.actionLoading = false;
      state.error = action.payload;
    },

    // Seed Data
    seedSongsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    seedSongsSuccess: (state) => {
      state.loading = false;
    },
    seedSongsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Modal state controls
    openCreateModal: (state) => {
      state.selectedSong = null;
      state.isFormModalOpen = true;
    },
    openEditModal: (state, action: PayloadAction<Song>) => {
      state.selectedSong = action.payload;
      state.isFormModalOpen = true;
    },
    closeFormModal: (state) => {
      state.selectedSong = null;
      state.isFormModalOpen = false;
    },
    openDeleteModal: (state, action: PayloadAction<Song>) => {
      state.deletingSong = action.payload;
    },
    closeDeleteModal: (state) => {
      state.deletingSong = null;
    },

    // Toast Notifications
    showToast: (
      state,
      action: PayloadAction<{ message: string; type: 'success' | 'error' | 'info' }>
    ) => {
      state.toast = {
        id: Date.now().toString(),
        message: action.payload.message,
        type: action.payload.type,
      };
    },
    clearToast: (state) => {
      state.toast = null;
    },
  },
});

export const {
  fetchSongsRequest,
  fetchSongsSuccess,
  fetchSongsFailure,
  setSearchFilter,
  setGenreFilter,
  setArtistFilter,
  setAlbumFilter,
  setFavoriteFilter,
  setPage,
  resetFilters,
  toggleFavoriteRequest,
  toggleFavoriteSuccess,
  toggleFavoriteFailure,
  createSongRequest,
  createSongSuccess,
  createSongFailure,
  updateSongRequest,
  updateSongSuccess,
  updateSongFailure,
  deleteSongRequest,
  deleteSongSuccess,
  deleteSongFailure,
  seedSongsRequest,
  seedSongsSuccess,
  seedSongsFailure,
  openCreateModal,
  openEditModal,
  closeFormModal,
  openDeleteModal,
  closeDeleteModal,
  showToast,
  clearToast,
} = songsSlice.actions;

export default songsSlice.reducer;
