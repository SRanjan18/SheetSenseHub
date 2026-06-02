import { Avatar, Box, Button, Divider, Paper, Typography } from '@mui/material';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useNavigate } from 'react-router-dom';
import './UserPanel.css';

function getInitials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .join('')
    .slice(0, 2);
}

function clearAllCookies() {
  document.cookie.split(';').forEach((cookie) => {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.slice(0, eqPos).trim() : cookie.trim();
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  });
}

export default function UserPanel({
  userName = 'Soumya R',
  role = 'Underwriting Support Team',
  email = 'soumya@example.com',
  onClose,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAllCookies();
    if (onClose) {
      onClose();
    }

    navigate('/logout', { replace: true });
  };

  return (
    <Paper elevation={10} className="user-panel">
      <Box className="user-panel__top">
        <Avatar className="user-panel__avatar">{getInitials(userName)}</Avatar>

        <Box className="user-panel__details">
          <Typography className="user-panel__name">{userName}</Typography>
          <Typography className="user-panel__role">{role}</Typography>
          <Typography className="user-panel__email">{email}</Typography>
        </Box>
      </Box>

      <Divider />

      <Box className="user-panel__actions">
        <Button
          onClick={handleLogout}
          className="user-panel__logout"
          startIcon={<LogoutRoundedIcon />}
        >
          Logout
        </Button>
      </Box>
    </Paper>
  );
}