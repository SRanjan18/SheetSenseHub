import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Menu,
  MenuItem,
  Popover,
  Toolbar,
  Typography,
} from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import UserPanel from './UserPanel/UserPanel';
import './Header.css';

export default function Header({
  selectedUseCase,
  useCases,
  onUseCaseSelect,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [useCaseAnchorEl, setUseCaseAnchorEl] = useState(null);
  const [userAnchorEl, setUserAnchorEl] = useState(null);

  const isDashboardRoute = location.pathname === '/dashboard';
  const isUseCaseMenuOpen = Boolean(useCaseAnchorEl);
  const isUserPanelOpen = Boolean(userAnchorEl);
  const useCaseLabel = selectedUseCase || 'Select';

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  const handleUseCaseMenuOpen = (event) => {
    setUseCaseAnchorEl(event.currentTarget);
  };

  const handleUseCaseMenuClose = () => {
    setUseCaseAnchorEl(null);
  };

  const handleUseCaseSelect = (useCase) => {
    onUseCaseSelect(useCase);
    handleUseCaseMenuClose();
  };

  const handleUserPanelOpen = (event) => {
    setUserAnchorEl(event.currentTarget);
  };

  const handleUserPanelClose = () => {
    setUserAnchorEl(null);
  };

  return (
    <AppBar position="static" elevation={0} className="shell-header">
      <Toolbar className="shell-header__toolbar">
        <Box className="shell-header__left">
          <Box className="shell-logo-container">
            <AutoAwesomeRoundedIcon className="shell-logo-icon" />
            <Typography component="div" className="shell-logo">
              RanjanLabs
            </Typography>
          </Box>

          <Box className="shell-divider" />

          <Typography component="div" className="shell-product">
            SheetSense Hub
          </Typography>
        </Box>

        <Box className="shell-header__nav">
          <Button
            className={`shell-link shell-link--nav ${
              location.pathname === '/dashboard' ? 'shell-link--active-tab' : ''
            }`}
            onClick={handleDashboardClick}
          >
            Dashboard
          </Button>

          {isDashboardRoute && (
            <>
              <Button
                className={`shell-link shell-link--nav ${
                  isUseCaseMenuOpen ? 'shell-link--active-tab' : ''
                }`}
                onClick={handleUseCaseMenuOpen}
                endIcon={<KeyboardArrowDownRoundedIcon />}
              >
                {useCaseLabel}
              </Button>

              <Menu
                anchorEl={useCaseAnchorEl}
                open={isUseCaseMenuOpen}
                onClose={handleUseCaseMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                PaperProps={{
                  className: 'shell-dropdown-paper',
                }}
              >
                {useCases.map((useCase) => (
                  <MenuItem
                    key={useCase}
                    selected={selectedUseCase === useCase}
                    onClick={() => handleUseCaseSelect(useCase)}
                    className="shell-dropdown-item"
                  >
                    {useCase}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}

          <Button
            className={`shell-link shell-link--nav ${
              location.pathname === '/contact-us' ? 'shell-link--active-tab' : ''
            }`}
            onClick={() => navigate('/contact-us')}
          >
            Contact Us
          </Button>

          <Button
            className={`shell-link shell-link--nav ${
              location.pathname === '/user-management' ? 'shell-link--active-tab' : ''
            }`}
            onClick={() => navigate('/user-management')}
          >
            User Management
          </Button>

          <Button
            className="shell-user-trigger"
            onClick={handleUserPanelOpen}
            endIcon={<KeyboardArrowDownRoundedIcon />}
          >
            <Avatar className="shell-user-badge">RS</Avatar>
            <span className="shell-user-trigger__text">Hi, Soumya</span>
          </Button>

          <Popover
            open={isUserPanelOpen}
            anchorEl={userAnchorEl}
            onClose={handleUserPanelClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              className: 'shell-user-popover',
            }}
          >
            <UserPanel
              userName="Soumya R"
              role={selectedUseCase || 'SheetSense Hub User'}
              email="soumya@example.com"
              onClose={handleUserPanelClose}
            />
          </Popover>
        </Box>
      </Toolbar>
    </AppBar>
  );
}