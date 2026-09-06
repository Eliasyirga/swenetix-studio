import { call, put, takeLatest, select } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { api } from '../services/api';
import { Song, CreateSongDto, UpdateSongDto, SongQueryFilters, PaginatedSongsResponse } from '../types/song';
import {
  fetchSongsRequest,
  fetchSongsSuccess,
  fetchSongsFailure,
  createSongRequest,
  createSongSuccess,
  createSongFailure,
  updateSongRequest,
  updateSongSuccess,
  updateSongFailure,
  deleteSongRequest,
  deleteSongSuccess,
  deleteSongFailure,
  toggleFavoriteRequest,
  toggleFavoriteSuccess,
  toggleFavoriteFailure,
  seedSongsRequest,
  seedSongsSuccess,
  seedSongsFailure,
  showToast,
} from './songsSlice';
import { fetchStatisticsRequest } from './statisticsSlice';
import { RootState } from './store';

const getFilters = (state: RootState) => state.songs.filters;

function* handleFetchSongs(action: PayloadAction<SongQueryFilters | undefined>): Generator {
  try {
    let filters = action.payload;
    if (!filters) {
      filters = (yield select(getFilters)) as SongQueryFilters;
    }
    const response = (yield call(api.getSongs, filters)) as PaginatedSongsResponse;
    yield put(fetchSongsSuccess(response));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch songs';
    yield put(fetchSongsFailure(message));
    yield put(showToast({ message, type: 'error' }));
  }
}

function* handleToggleFavorite(action: PayloadAction<string>): Generator {
  try {
    const songId = action.payload;
    const updated = (yield call(api.toggleFavorite, songId)) as Song;
    yield put(toggleFavoriteSuccess(updated));
    yield put(
      showToast({
        message: updated.isFavorite
          ? `⭐ Added "${updated.title}" to favorites`
          : `Removed "${updated.title}" from favorites`,
        type: 'info',
      })
    );

    // Refresh statistics to update favorites counts
    yield put(fetchStatisticsRequest());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update favorite status';
    yield put(toggleFavoriteFailure({ id: action.payload, error: message }));
    yield put(showToast({ message, type: 'error' }));
  }
}

function* handleCreateSong(action: PayloadAction<CreateSongDto>): Generator {
  try {
    const newSong = (yield call(api.createSong, action.payload)) as Song;
    yield put(createSongSuccess(newSong));
    yield put(showToast({ message: `"${newSong.title}" added to library.`, type: 'success' }));

    // Reactively refresh current song list and statistics without full page reload
    yield put(fetchSongsRequest());
    yield put(fetchStatisticsRequest());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create song';
    yield put(createSongFailure(message));
    yield put(showToast({ message, type: 'error' }));
  }
}

function* handleUpdateSong(action: PayloadAction<UpdateSongDto>): Generator {
  try {
    const updatedSong = (yield call(api.updateSong, action.payload)) as Song;
    yield put(updateSongSuccess(updatedSong));
    yield put(showToast({ message: `"${updatedSong.title}" updated successfully.`, type: 'success' }));

    // Reactively refresh current song list and statistics without full page reload
    yield put(fetchSongsRequest());
    yield put(fetchStatisticsRequest());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update song';
    yield put(updateSongFailure(message));
    yield put(showToast({ message, type: 'error' }));
  }
}

function* handleDeleteSong(action: PayloadAction<string>): Generator {
  try {
    const deletedId = (yield call(api.deleteSong, action.payload)) as string;
    yield put(deleteSongSuccess(deletedId));
    yield put(showToast({ message: 'Song deleted successfully.', type: 'success' }));

    // Reactively refresh current song list and statistics without full page reload
    yield put(fetchSongsRequest());
    yield put(fetchStatisticsRequest());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete song';
    yield put(deleteSongFailure(message));
    yield put(showToast({ message, type: 'error' }));
  }
}

function* handleSeedSongs(): Generator {
  try {
    const result = (yield call(api.seedSongs)) as { count: number };
    yield put(seedSongsSuccess());
    yield put(showToast({ message: `Seeded ${result.count} sample songs.`, type: 'success' }));

    // Reactively refresh library and statistics
    yield put(fetchSongsRequest({ page: 1 }));
    yield put(fetchStatisticsRequest());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to seed sample songs';
    yield put(seedSongsFailure(message));
    yield put(showToast({ message, type: 'error' }));
  }
}

export function* songsSaga(): Generator {
  yield takeLatest(fetchSongsRequest.type, handleFetchSongs);
  yield takeLatest(toggleFavoriteRequest.type, handleToggleFavorite);
  yield takeLatest(createSongRequest.type, handleCreateSong);
  yield takeLatest(updateSongRequest.type, handleUpdateSong);
  yield takeLatest(deleteSongRequest.type, handleDeleteSong);
  yield takeLatest(seedSongsRequest.type, handleSeedSongs);
}
