import { Box, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Footer.css';

export default function Footer() {
  const { canViewAnalytics, canViewReports } = useAuth();

  return (
    <Box component="footer" className="shell-footer">
      <Typography className="shell-footer__copy">
        © 2026 All Rights Reserved.
      </Typography>

      <Box className="shell-footer__links">
        <Link component={RouterLink} to="/dashboard" underline="none" className="shell-footer__link">
          Processing
        </Link>

        {canViewReports && (
          <>
            <span className="shell-footer__separator">|</span>
            <Link component={RouterLink} to="/report" underline="none" className="shell-footer__link">
              Report
            </Link>
          </>
        )}

        {canViewAnalytics && (
          <>
            <span className="shell-footer__separator">|</span>
            <Link component={RouterLink} to="/analytics" underline="none" className="shell-footer__link">
              Analytics
            </Link>
          </>
        )}

        <span className="shell-footer__separator">|</span>
        <Link component={RouterLink} to="/contact-us" underline="none" className="shell-footer__link">
          Contact Us
        </Link>
      </Box>
    </Box>
  );
}