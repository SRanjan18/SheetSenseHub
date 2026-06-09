import { Alert, Snackbar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { hideToast } from '../../store/toast';

export default function AppToast() {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector((state) => state.toast);
  const isInProgress = severity === 'info';
  const autoHideDuration = isInProgress ? null : 2000;
  const handleClose = isInProgress ? undefined : () => dispatch(hideToast());

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ mt: 2, zIndex: 12000 }}
    >
      <Alert
        variant="filled"
        severity={severity}
        onClose={handleClose}
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
