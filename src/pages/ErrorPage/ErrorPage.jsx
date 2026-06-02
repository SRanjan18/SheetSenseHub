import { useEffect } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './ErrorPage.css';

function clearAllCookies() {
  document.cookie.split(';').forEach((cookie) => {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.slice(0, eqPos).trim() : cookie.trim();
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  });
}

export default function ErrorPage() {
  const navigate = useNavigate();

  useEffect(() => {
    clearAllCookies();
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