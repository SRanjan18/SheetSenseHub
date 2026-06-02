import { Box, Link, Typography } from '@mui/material';
import './Footer.css';

export default function Footer() {
  return (
    <Box component="footer" className="shell-footer">
      <Typography className="shell-footer__copy">
        © 2026 All Rights Reserved.
      </Typography>

      <Box className="shell-footer__links">
        <Link href="#" underline="none" className="shell-footer__link">
          File Station
        </Link>
        <span className="shell-footer__separator">|</span>

        <Link href="#" underline="none" className="shell-footer__link">
          Report
        </Link>
        <span className="shell-footer__separator">|</span>

        <Link href="#" underline="none" className="shell-footer__link">
          Analytics
        </Link>
        <span className="shell-footer__separator">|</span>

        <Link href="#" underline="none" className="shell-footer__link">
          Contact Us
        </Link>
      </Box>
    </Box>
  );
}