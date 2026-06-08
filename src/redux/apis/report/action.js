import config from '../../../config/config';
import {
  REPORT_FETCH_FAILURE,
  REPORT_FETCH_REQUEST,
  REPORT_FETCH_SUCCESS,
  REPORT_RESET,
} from './type';

export const resetReport = () => ({
  type: REPORT_RESET,
});

export const fetchReport = (payload) => async (dispatch) => {
  dispatch({
    type: REPORT_FETCH_REQUEST,
    toast: { message: 'Report request in progress', severity: 'info' },
  });

  try {
    const response = await fetch(`${config.apiBaseUrl}/api/ingestions/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch report data');
    }

    const data = await response.json();
    const safeData = Array.isArray(data) ? data : [];

    dispatch({
      type: REPORT_FETCH_SUCCESS,
      payload: safeData,
      toast: { message: 'Report data loaded successfully', severity: 'success' },
    });

    return safeData;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch report data';

    dispatch({
      type: REPORT_FETCH_FAILURE,
      payload: message,
      toast: { message, severity: 'error' },
    });
    throw error;
  }
};
