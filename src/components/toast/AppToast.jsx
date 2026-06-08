import { Alert, Snackbar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { hideToast } from '../../store/toast';

export default function AppToast() {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector((state) => state.toast);

  return (
    <Snackbar
      open={open}
      autoHideDuration={4500}
      onClose={() => dispatch(hideToast())}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ mt: 8 }}
    >
      <Alert
        variant="filled"
        severity={severity}
        onClose={() => dispatch(hideToast())}
        sx={{
          minWidth: 320,
          borderRadius: 2,
          boxShadow: '0 16px 40px rgba(14, 59, 52, 0.18)',
          fontWeight: 700,
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
