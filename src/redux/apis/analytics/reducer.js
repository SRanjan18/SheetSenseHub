import {
  ANALYTICS_FETCH_FAILURE,
  ANALYTICS_FETCH_REQUEST,
  ANALYTICS_FETCH_SUCCESS,
  ANALYTICS_RESET,
} from './type';

const initialState = {
  loading: false,
  data: {
    statusSummary: [],
    productPopularity: [],
    dailyTransactions: [],
    weeklyTransactions: [],
    monthlyTransactions: [],
  },
  error: '',
};

export default function analyticsReducer(state = initialState, action) {
  switch (action.type) {
    case ANALYTICS_FETCH_REQUEST:
      return {
        ...state,
        loading: true,
        error: '',
      };

    case ANALYTICS_FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: '',
      };

    case ANALYTICS_FETCH_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case ANALYTICS_RESET:
      return initialState;

    default:
      return state;
  }
}
