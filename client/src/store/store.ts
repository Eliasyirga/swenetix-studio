import { configureStore, combineReducers } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import songsReducer from './songsSlice';
import statisticsReducer from './statisticsSlice';
import { songsSaga } from './songsSaga';
import { statisticsSaga } from './statisticsSaga';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

function* rootSaga(): Generator {
  yield all([fork(songsSaga), fork(statisticsSaga)]);
}

const rootReducer = combineReducers({
  songs: songsReducer,
  statistics: statisticsReducer,
});

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    }).concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
