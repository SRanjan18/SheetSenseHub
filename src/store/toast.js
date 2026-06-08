const SHOW_TOAST = 'toast/SHOW_TOAST';
const HIDE_TOAST = 'toast/HIDE_TOAST';

const initialState = {
  open: false,
  message: '',
  severity: 'info',
};

export const showToast = ({ message, severity = 'info' }) => ({
  type: SHOW_TOAST,
  payload: {
    message,
    severity,
  },
});

export const hideToast = () => ({
  type: HIDE_TOAST,
});

export const toastMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  if (action.toast && action.type !== SHOW_TOAST) {
    store.dispatch(showToast(action.toast));
  }

  return result;
};

export default function toastReducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_TOAST:
      return {
        open: true,
        message: action.payload.message,
        severity: action.payload.severity,
      };

    case HIDE_TOAST:
      return {
        ...state,
        open: false,
      };

    default:
      return state;
  }
}
