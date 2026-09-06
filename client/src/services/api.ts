import axios from 'axios';
import {
  Song,
  CreateSongDto,
  UpdateSongDto,
  SongQueryFilters,
  PaginatedSongsResponse,
} from '../types/song';
import { StatisticsData, ApiResponse } from '../types/statistics';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://swenetix-studio.onrender.com/api'
    : 'http://localhost:5000/api');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const api = {
  // Songs API
  getSongs: async (filters: SongQueryFilters = {}): Promise<PaginatedSongsResponse> => {
    const params: Record<string, string | number> = {};
    if (filters.search && filters.search.trim() !== '') params.search = filters.search.trim();
    if (filters.genre && filters.genre !== 'All') params.genre = filters.genre;
    if (filters.artist && filters.artist !== 'All') params.artist = filters.artist;
    if (filters.album && filters.album !== 'All') params.album = filters.album;
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;

    const response = await apiClient.get<ApiResponse<PaginatedSongsResponse>>('/songs', { params });
    return response.data.data;
  },

  getSongById: async (id: string): Promise<Song> => {
    const response = await apiClient.get<ApiResponse<Song>>(`/songs/${id}`);
    return response.data.data;
  },

  createSong: async (payload: CreateSongDto): Promise<Song> => {
    const response = await apiClient.post<ApiResponse<Song>>('/songs', payload);
    return response.data.data;
  },

  updateSong: async ({ id, data }: UpdateSongDto): Promise<Song> => {
    const response = await apiClient.put<ApiResponse<Song>>(`/songs/${id}`, data);
    return response.data.data;
  },

  deleteSong: async (id: string): Promise<string> => {
    await apiClient.delete<ApiResponse<{ id: string }>>(`/songs/${id}`);
    return id;
  },

  seedSongs: async (): Promise<{ count: number }> => {
    const response = await apiClient.post<ApiResponse<{ count: number }>>('/songs/seed');
    return response.data.data;
  },

  // Statistics API
  getStatistics: async (): Promise<StatisticsData> => {
    const response = await apiClient.get<ApiResponse<StatisticsData>>('/statistics');
    return response.data.data;
  },

  // Health API
  getHealth: async (): Promise<{ status: string; database: string }> => {
    const response = await apiClient.get<ApiResponse<{ status: string; database: string }>>('/health');
    return response.data.data;
  },
};
