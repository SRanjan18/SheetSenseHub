import { Box, Chip, Container, Paper, Stack, Typography } from '@mui/material';
import { BUSINESS_DETAILS } from '../../config/businesses';
import { useBusiness } from '../../context/businessContext';

export default function AboutPage() {
  const { selectedBusiness } = useBusiness();
  const activeBusiness =
    BUSINESS_DETAILS.find((business) => business.name === selectedBusiness) ||
    BUSINESS_DETAILS[0];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <Box
        sx={{
          minHeight: 180,
          background:
            'radial-gradient(circle at 50% 0%, rgba(183, 227, 95, 0.18), transparent 28%), linear-gradient(135deg, #062721 0%, #0b2f2a 48%, #0e3b34 100%)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          px: 2,
        }}
      >
        <Box>
          <Typography
            variant="h3"
            sx={{ fontFamily: 'Georgia, serif', fontWeight: 800, mb: 1 }}
          >
            About SheetSense Businesses
          </Typography>
          <Typography sx={{ color: '#dff8f2', maxWidth: 780, mx: 'auto' }}>
            One platform, multiple business workflows. Each business keeps the
            experience familiar while exposing the actions needed for that workstream.
          </Typography>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper
          sx={{
            p: { xs: 2.5, md: 3 },
            mb: 3,
            border: '1px solid rgba(0, 133, 111, 0.16)',
            borderTop: '4px solid #b7e35f',
            boxShadow: '0 18px 45px rgba(14, 59, 52, 0.08)',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0e3b34', mb: 1 }}>
            Why There Are Multiple Businesses
          </Typography>
          <Typography sx={{ color: '#5f6f68', lineHeight: 1.7 }}>
            SheetSense Hub is designed as a shared processing layer for different
            business lines. The underlying platform handles ingestion, analytics,
            reports, and search, but each business has a different operational story.
            Some teams process new files, some manage reference data, and some search
            processed quote records. That is why several dashboards look similar while
            still representing separate business workflows.
          </Typography>
        </Paper>

        <Paper
          sx={{
            p: 2.5,
            border: '1px solid rgba(0, 133, 111, 0.16)',
            background: 'linear-gradient(180deg, #ffffff 0%, #f1faf6 100%)',
            boxShadow: '0 14px 34px rgba(14, 59, 52, 0.08)',
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#00856f' }}>
              {activeBusiness.name}
            </Typography>
            <Chip
              size="small"
              label={`${activeBusiness.cardCount} cards`}
              sx={{
                backgroundColor: 'rgba(183, 227, 95, 0.3)',
                color: '#0e3b34',
                fontWeight: 700,
              }}
            />
          </Stack>

          <Typography sx={{ color: '#17211d', lineHeight: 1.65, mb: 2 }}>
            {activeBusiness.story}
          </Typography>

          <Box
            sx={{
              borderRadius: 2,
              p: 1.5,
              backgroundColor: '#fff',
              border: '1px solid #d8e4de',
            }}
          >
            <Typography sx={{ fontSize: 12, fontWeight: 800, color: '#5f6f68', mb: 0.5 }}>
              What makes it different
            </Typography>
            <Typography sx={{ color: '#0e3b34', fontWeight: 700 }}>
              {activeBusiness.whyDifferent}
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
