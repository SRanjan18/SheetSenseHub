import { useEffect } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './LogoutPage.css';

export default function LogoutPage() {
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    console.log('[Logout] LogoutPage mounted at', window.location.pathname);
    console.log('[Logout] Calling auth.logout');
    if (auth?.logout) {
      auth.logout();
    }
  }, [auth]);

  return (
    <Box className="logout-page">
      <Paper elevation={6} className="logout-page__card">
        <Typography variant="h3" className="logout-page__title">
          Signed Out
        </Typography>

        <Typography className="logout-page__message">
          You have been successfully signed out.
        </Typography>

        <Typography className="logout-page__subtext">
          Please mail us for feedback at <strong>support@ranjanlabs.com</strong>
        </Typography>

        <Button
          variant="contained"
          className="logout-page__button"
          onClick={() => navigate('/login')}
        >
          Return To SheetSense Hub
        </Button>
      </Paper>
    </Box>
  );
}