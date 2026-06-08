import {
  REPORT_FETCH_FAILURE,
  REPORT_FETCH_REQUEST,
  REPORT_FETCH_SUCCESS,
  REPORT_RESET,
} from './type';

const initialState = {
  loading: false,
  data: [],
  error: '',
};

export default function reportReducer(state = initialState, action) {
  switch (action.type) {
    case REPORT_FETCH_REQUEST:
      return {
        ...state,
        loading: true,
        error: '',
      };

    case REPORT_FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: '',
      };

    case REPORT_FETCH_FAILURE:
      return {
        ...state,
        loading: false,
        data: [],
        error: action.payload,
      };

    case REPORT_RESET:
      return initialState;

    default:
      return state;
  }
}
