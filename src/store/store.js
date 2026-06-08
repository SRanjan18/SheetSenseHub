import { configureStore } from '@reduxjs/toolkit';
import appReducer from '../features/app/appSlice';
import analyticsReducer from '../redux/apis/analytics/reducer';
import fileDownloadReducer from '../redux/apis/fileDownload/reducer';
import ingestionReducer from '../redux/apis/ingestion/reducer';
import reportReducer from '../redux/apis/report/reducer';
import toastReducer, { toastMiddleware } from './toast';

export const store = configureStore({
  reducer: {
    app: appReducer,
    analytics: analyticsReducer,
    fileDownload: fileDownloadReducer,
    ingestion: ingestionReducer,
    report: reportReducer,
    toast: toastReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(toastMiddleware),
});
