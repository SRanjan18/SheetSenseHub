import config from '../../../config/config';
import {
  ANALYTICS_FETCH_FAILURE,
  ANALYTICS_FETCH_REQUEST,
  ANALYTICS_FETCH_SUCCESS,
  ANALYTICS_RESET,
} from './type';

const analyticsEndpoints = [
  ['statusSummary', 'status-summary'],
  ['productPopularity', 'product-popularity'],
  ['dailyTransactions', 'daily-transactions'],
  ['weeklyTransactions', 'weekly-transactions'],
  ['monthlyTransactions', 'monthly-transactions'],
];

export const resetAnalytics = () => ({
  type: ANALYTICS_RESET,
  toast: { message: 'Analytics data reset', severity: 'info' },
});

const callAnalyticsApi = async (endpoint, payload) => {
  const response = await fetch(`${config.apiBaseUrl}/api/analytics/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`${endpoint} failed`);
  }

  return response.json();
};

export const fetchAnalytics = (payload) => async (dispatch) => {
  dispatch({
    type: ANALYTICS_FETCH_REQUEST,
    toast: { message: 'Analytics request in progress', severity: 'info' },
  });

  const results = await Promise.allSettled(
    analyticsEndpoints.map(([, endpoint]) => callAnalyticsApi(endpoint, payload))
  );

  const nextData = analyticsEndpoints.reduce((acc, [key], index) => {
    acc[key] = results[index].status === 'fulfilled' ? results[index].value : [];
    return acc;
  }, {});

  const failedEndpoints = results
    .map((result, index) => (result.status === 'rejected' ? analyticsEndpoints[index][1] : null))
    .filter(Boolean);

  if (failedEndpoints.length) {
    const message = `Analytics failed for: ${failedEndpoints.join(', ')}`;
    dispatch({
      type: ANALYTICS_FETCH_FAILURE,
      payload: message,
      toast: { message, severity: 'error' },
    });
    return nextData;
  }

  dispatch({
    type: ANALYTICS_FETCH_SUCCESS,
    payload: nextData,
    toast: { message: 'Analytics data loaded successfully', severity: 'success' },
  });

  return nextData;
};
