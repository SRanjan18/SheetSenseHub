import { useEffect, useRef } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../reusable/apiClient';
import { clearBrowserManagedAppCookies } from '../../reusable/cookies';
import './ErrorPage.css';

function clearAppSession() {
  clearBrowserManagedAppCookies();
  apiFetch('/api/auth/logout', { method: 'POST' }).catch(() => {
    // The error page should still render even if there is no backend session to clear.
  });
}

export default function ErrorPage() {
  const navigate = useNavigate();
  const hasClearedSession = useRef(false);

  useEffect(() => {
    if (hasClearedSession.current) return;
    hasClearedSession.current = true;

    clearAppSession();
  }, []);

  return (
    <Box className="system-page">
      <Paper elevation={6} className="system-page__card">
        <Typography variant="h3" className="system-page__title">
          Access Restricted
        </Typography>

        <Typography className="system-page__message">
          You do not have access to SheetSense.
        </Typography>

        <Typography className="system-page__subtext">
          In case of queries, please reach out to{' '}
          <strong>support@ranjanlabs.com</strong>
        </Typography>

        <Button
          variant="contained"
          className="system-page__button"
          onClick={() => navigate('/login')}
        >
          Return to Login
        </Button>
      </Paper>
    </Box>
  );
}