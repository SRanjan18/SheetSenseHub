import config from '../../../config/config';
import {
  INGESTION_RESET,
  INGESTION_UPLOAD_FAILURE,
  INGESTION_UPLOAD_REQUEST,
  INGESTION_UPLOAD_SUCCESS,
} from './type';

export const resetIngestion = () => ({
  type: INGESTION_RESET,
});

export const uploadIngestion = ({ file, payload }) => async (dispatch) => {
  dispatch({
    type: INGESTION_UPLOAD_REQUEST,
    toast: { message: 'Ingestion in progress', severity: 'info' },
  });

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('payload', JSON.stringify(payload));

    const response = await fetch(`${config.apiBaseUrl}/api/ranjanLabs/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Ingestion failed with status ${response.status}`);
    }

    const result = await response.json();
    const safeResult = {
      ...result,
      body: Array.isArray(result?.body) ? result.body : [],
    };

    dispatch({
      type: INGESTION_UPLOAD_SUCCESS,
      payload: safeResult,
      toast: { message: 'Ingestion completed successfully', severity: 'success' },
    });

    return safeResult;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Something went wrong during ingestion.';

    dispatch({
      type: INGESTION_UPLOAD_FAILURE,
      payload: message,
      toast: { message, severity: 'error' },
    });
    throw error;
  }
};
