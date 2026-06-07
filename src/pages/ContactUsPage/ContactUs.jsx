import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import contactUsBackground from '../../assets/contact_us.svg';

const contactItems = [
  {
    title: 'Support',
    text: 'If Experiencing any IT/System issues, please contact us below',
    email: 'support@ranjanlabs.com',
  },
  {
    title: 'Feedback',
    text: 'Give your valuable feedback on below',
    email: 'feedback@ranjanlabs.com',
  },
];

export default function ContactUs() {
  return (
    <Box sx={{ backgroundColor: '#fff', minHeight: '100%' }}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 260,
          background:
            'radial-gradient(circle at 50% 0%, rgba(183, 227, 95, 0.14), transparent 26%), linear-gradient(135deg, #062721 0%, #0b2f2a 48%, #0e3b34 100%)',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={contactUsBackground}
          alt="Contact Us Background"
          sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: { xs: '88vw', md: 760, lg: 900 },
            maxWidth: 'calc(100% - 80px)',
            height: 'auto',
            transform: 'translate(-50%, -50%)',
            opacity: 0.68,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(6, 39, 33, 0.5) 0%, rgba(6, 39, 33, 0.2) 48%, rgba(6, 39, 33, 0.5) 100%), linear-gradient(rgba(0,0,0,0.08), rgba(0,0,0,0.34))',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            textAlign: 'center',
            px: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: 36,
              fontWeight: 700,
              textShadow: '0 12px 30px rgba(0, 0, 0, 0.35)',
              letterSpacing: '0.04em',
            }}
          >
            Contact Us
          </Typography>
          <Typography sx={{ fontSize: 13, mt: 1, color: '#dff8f2' }}>
            Our teams are here to help
          </Typography>
        </Box>
      </Box>

      <Container
        maxWidth="xl"
        sx={{
          mt: -6,
          pb: 6,
          position: 'relative',
          zIndex: 2,
          px: 2,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={15}
          justifyContent="center"
          alignItems="center"
          sx={{ width: '100%', maxWidth: 820, mx: 'auto' }}
        >
          {contactItems.map((item) => (
            <Card
              key={item.title}
              sx={{
                width: '100%',
                maxWidth: 360,
                border: '1px solid rgba(0, 133, 111, 0.22)',
                borderTop: '4px solid #b7e35f',
                backgroundColor: '#f1faf6',
                boxShadow: '0px 18px 45px rgba(14, 59, 52, 0.08)',
                borderRadius: 3,
                mx: 'auto',
              }}
            >
              <CardContent
                sx={{
                  textAlign: 'center',
                  py: 3,
                  px: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  minHeight: 220,
                }}
              >
                <Typography
                  sx={{
                    color: '#00856f',
                    fontWeight: 700,
                    fontSize: 26,
                    mb: 2,
                    letterSpacing: '0.01em',
                  }}
                >
                  {item.title}
                </Typography>

                <Typography
                  sx={{
                    fontSize: 15,
                    color: '#17211d',
                    mb: 3,
                    minHeight: 42,
                  }}
                >
                  {item.text}
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  justifyContent="center"
                  sx={{ mb: 2 }}
                >
                  <EmailOutlinedIcon sx={{ fontSize: 22, color: '#006c5b' }} />
                  <Link
                    href={`mailto:${item.email}`}
                    underline="hover"
                    sx={{
                      color: '#006c5b',
                      fontSize: 15,
                      fontWeight: 600,
                      wordBreak: 'break-word',
                    }}
                  >
                    {item.email}
                  </Link>
                </Stack>

                <Button
                  variant="contained"
                  href={`mailto:${item.email}`}
                  sx={{
                    background: 'linear-gradient(135deg, #00856f 0%, #006c5b 100%)',
                    border: '1px solid rgba(183, 227, 95, 0.42)',
                    boxShadow: '0 10px 24px rgba(0, 133, 111, 0.18)',
                    color: '#fff',
                    textTransform: 'none',
                    alignSelf: 'center',
                    px: 3,
                    py: 1.25,
                    fontSize: 14,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #006c5b 0%, #0b2f2a 100%)',
                      boxShadow: '0 12px 28px rgba(0, 108, 91, 0.24)',
                    },
                  }}
                >
                  Send Email
                </Button>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
