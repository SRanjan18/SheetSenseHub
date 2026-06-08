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

export default function UserPanel({
  userName = 'SheetSense User',
  role = 'SheetSense Hub User',
  email = 'sheetSense Hub User Mail',
  onClose,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
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