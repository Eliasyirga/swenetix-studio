import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StatisticsData } from '../types/statistics';

export interface StatisticsState {
  data: StatisticsData | null;
  loading: boolean;
  error: string | null;
}

const initialState: StatisticsState = {
  data: null,
  loading: false,
  error: null,
};

const statisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {
    fetchStatisticsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchStatisticsSuccess: (state, action: PayloadAction<StatisticsData>) => {
      state.loading = false;
      state.data = action.payload;
    },
    fetchStatisticsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchStatisticsRequest,
  fetchStatisticsSuccess,
  fetchStatisticsFailure,
} = statisticsSlice.actions;

export default statisticsSlice.reducer;
