import {
  FILE_DOWNLOAD_FAILURE,
  FILE_DOWNLOAD_REQUEST,
  FILE_DOWNLOAD_RESET,
  FILE_DOWNLOAD_SUCCESS,
} from './type';

const initialState = {
  loading: false,
  url: '',
  error: '',
};

export default function fileDownloadReducer(state = initialState, action) {
  switch (action.type) {
    case FILE_DOWNLOAD_REQUEST:
      return {
        ...state,
        loading: true,
        error: '',
      };

    case FILE_DOWNLOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        url: action.payload,
        error: '',
      };

    case FILE_DOWNLOAD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case FILE_DOWNLOAD_RESET:
      return initialState;

    default:
      return state;
  }
}
