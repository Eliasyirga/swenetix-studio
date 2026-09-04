import { call, put, takeLatest } from 'redux-saga/effects';
import { api } from '../services/api';
import { StatisticsData } from '../types/statistics';
import {
  fetchStatisticsRequest,
  fetchStatisticsSuccess,
  fetchStatisticsFailure,
} from './statisticsSlice';

function* handleFetchStatistics(): Generator {
  try {
    const data = (yield call(api.getStatistics)) as StatisticsData;
    yield put(fetchStatisticsSuccess(data));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch statistics';
    yield put(fetchStatisticsFailure(message));
  }
}

export function* statisticsSaga(): Generator {
  yield takeLatest(fetchStatisticsRequest.type, handleFetchStatistics);
}
