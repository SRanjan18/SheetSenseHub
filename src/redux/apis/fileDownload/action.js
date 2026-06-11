import config from '../../../config/config';
import {
  FILE_DOWNLOAD_FAILURE,
  FILE_DOWNLOAD_REQUEST,
  FILE_DOWNLOAD_SUCCESS,
  FILE_DOWNLOAD_RESET,
} from './type';

export const resetFileDownload = () => ({
  type: FILE_DOWNLOAD_RESET,
});

export const prepareFileDownload = (fileName) => (dispatch) => {
  dispatch({
    type: FILE_DOWNLOAD_REQUEST,
    toast: { message: 'File download starting', severity: 'info' },
  });

  if (!fileName) {
    const message = 'Download file is not available.';
    dispatch({
      type: FILE_DOWNLOAD_FAILURE,
      payload: message,
      toast: { message, severity: 'error' },
    });
    throw new Error(message);
  }

  const downloadUrl = `${config.apiBaseUrl}/api/ranjanLabs/download/${fileName}`;

  dispatch({
    type: FILE_DOWNLOAD_SUCCESS,
    payload: downloadUrl,
    toast: { message: 'File download started', severity: 'success' },
  });

  return downloadUrl;
};
