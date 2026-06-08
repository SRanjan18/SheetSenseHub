import {
  INGESTION_RESET,
  INGESTION_UPLOAD_FAILURE,
  INGESTION_UPLOAD_REQUEST,
  INGESTION_UPLOAD_SUCCESS,
} from './type';

const initialState = {
  loading: false,
  data: null,
  error: '',
};

export default function ingestionReducer(state = initialState, action) {
  switch (action.type) {
    case INGESTION_UPLOAD_REQUEST:
      return {
        ...state,
        loading: true,
        error: '',
        data: null,
      };

    case INGESTION_UPLOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: '',
      };

    case INGESTION_UPLOAD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case INGESTION_RESET:
      return initialState;

    default:
      return state;
  }
}
