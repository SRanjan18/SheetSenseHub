import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {AppBar,Avatar,Box,Button,Menu,MenuItem,Popover,Toolbar,Typography,} from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { useAuth } from '../../context/AuthContext';
import UserPanel from './UserPanel/UserPanel';
import './Header.css';

function getInitials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .join('')
    .slice(0, 2);
}

function getRoleLabel(user, selectedBusiness) {
  const businessRole = user?.businessRoles?.find(
    (item) => item.businessName === selectedBusiness
  );

  return businessRole?.roleName || businessRole?.roleCode || 'SheetSense Hub User';
}

export default function Header({ selectedBusiness, businesses, onBusinessSelect }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, canManageUsers } = useAuth();

  const [businessAnchorEl, setBusinessAnchorEl] = useState(null);
  const [userAnchorEl, setUserAnchorEl] = useState(null);

  const isDashboardRoute = location.pathname === '/dashboard';
  const isBusinessMenuOpen = Boolean(businessAnchorEl);
  const isUserPanelOpen = Boolean(userAnchorEl);
  const businessLabel = selectedBusiness || 'Select';
  const userName = user?.name || user?.email || 'SheetSense User';
  const userInitials = getInitials(userName) || 'SS';
  const roleLabel = getRoleLabel(user, selectedBusiness);

  const handleBusinessSelect = (business) => {
    onBusinessSelect(business);
    setBusinessAnchorEl(null);
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
            onClick={() => navigate('/about')}
          >
            About
          </Button>

          <Button
            className={`shell-link shell-link--nav ${
              location.pathname === '/dashboard' ? 'shell-link--active-tab' : ''
            }`}
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </Button>

          {isDashboardRoute && (
            <>
              <Button
                className={`shell-link shell-link--nav ${
                  isBusinessMenuOpen ? 'shell-link--active-tab' : ''
                }`}
                onClick={(event) => setBusinessAnchorEl(event.currentTarget)}
                endIcon={<KeyboardArrowDownRoundedIcon />}
              >
                {businessLabel}
              </Button>

              <Menu
                anchorEl={businessAnchorEl}
                open={isBusinessMenuOpen}
                onClose={() => setBusinessAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                slotProps={{ paper: { className: 'shell-dropdown-paper' } }}
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

          {canManageUsers && (
            <Button
              className={`shell-link shell-link--nav ${
                location.pathname === '/user-management' ? 'shell-link--active-tab' : ''
              }`}
              onClick={() => navigate('/user-management')}
            >
              User Management
            </Button>
          )}

          <Button
            className="shell-user-trigger"
            onClick={(event) => setUserAnchorEl(event.currentTarget)}
            endIcon={<KeyboardArrowDownRoundedIcon />}
          >
            <Avatar className="shell-user-badge">{userInitials}</Avatar>
            <span className="shell-user-trigger__text">Hi, {userName.split(' ')[0]}</span>
          </Button>

          <Popover
            open={isUserPanelOpen}
            anchorEl={userAnchorEl}
            onClose={() => setUserAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{ paper: { className: 'shell-user-popover' } }}
          >
            <UserPanel
              userName={userName}
              role={roleLabel}
              email={user?.email || ''}
              onClose={() => setUserAnchorEl(null)}
            />
          </Popover>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
