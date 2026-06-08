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
  selectedBusiness,
  businesses,
  onBusinessSelect,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [businessAnchorEl, setBusinessAnchorEl] = useState(null);
  const [userAnchorEl, setUserAnchorEl] = useState(null);

  const isDashboardRoute = location.pathname === '/dashboard';
  const isBusinessMenuOpen = Boolean(businessAnchorEl);
  const isUserPanelOpen = Boolean(userAnchorEl);
  const businessLabel = selectedBusiness || 'Select';

  const handleAboutClick = () => {
    navigate('/about');
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  const handleBusinessMenuOpen = (event) => {
    setBusinessAnchorEl(event.currentTarget);
  };

  const handleBusinessMenuClose = () => {
    setBusinessAnchorEl(null);
  };

  const handleBusinessSelect = (business) => {
    onBusinessSelect(business);
    handleBusinessMenuClose();
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
              location.pathname === '/about' ? 'shell-link--active-tab' : ''
            }`}
            onClick={handleAboutClick}
          >
            About
          </Button>

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
                  isBusinessMenuOpen ? 'shell-link--active-tab' : ''
                }`}
                onClick={handleBusinessMenuOpen}
                endIcon={<KeyboardArrowDownRoundedIcon />}
              >
                {businessLabel}
              </Button>

              <Menu
                anchorEl={businessAnchorEl}
                open={isBusinessMenuOpen}
                onClose={handleBusinessMenuClose}
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
                {businesses.map((business) => (
                  <MenuItem
                    key={business}
                    selected={selectedBusiness === business}
                    onClick={() => handleBusinessSelect(business)}
                    className="shell-dropdown-item"
                  >
                    {business}
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
              role={selectedBusiness || 'SheetSense Hub User'}
              email="soumya@example.com"
              onClose={handleUserPanelClose}
            />
          </Popover>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
