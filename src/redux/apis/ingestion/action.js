import config from '../../../config/config';
import {
  INGESTION_RESET,
  INGESTION_UPLOAD_FAILURE,
  INGESTION_UPLOAD_REQUEST,
  INGESTION_UPLOAD_SUCCESS,
} from './type';

const downloadGeneratedFile = async (result) => {
  if (!result?.output_file_download_url) {
    throw new Error("Generated file download URL is missing.");
  }

  const response = await fetch(config.apiBaseUrl + result.output_file_download_url, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("File download failed with status " + response.status);
  }

  const blob = await response.blob();
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = result.output_file_name || "processed-output.xlsx";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(objectUrl);
};

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
      credentials: 'include',
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

    try {
      await downloadGeneratedFile(safeResult);
      dispatch({
        type: INGESTION_UPLOAD_SUCCESS,
        payload: safeResult,
        toast: { message: 'Ingestion completed and file downloaded', severity: 'success' },
      });
    } catch (downloadError) {
      dispatch({
        type: INGESTION_UPLOAD_SUCCESS,
        payload: safeResult,
        toast: {
          message: downloadError instanceof Error
            ? downloadError.message
            : 'Processing completed, but file download failed.',
          severity: 'error',
        },
      });
    }

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
