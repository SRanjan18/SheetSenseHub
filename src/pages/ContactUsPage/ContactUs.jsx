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
          backgroundColor: '#0c1e3f',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={contactUsBackground}
          alt="Contact Us Background"
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.95,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.45))',
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
          <Typography sx={{ fontSize: 13, mt: 1, color: '#d8e2ff' }}>
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
                border: '1px solid rgba(95, 127, 189, 0.22)',
                backgroundColor: '#f7f9ff',
                boxShadow: '0px 18px 45px rgba(15, 40, 78, 0.08)',
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
                    color: '#4a77c1',
                    fontWeight: 700,
                    fontSize: 26,
                    mb: 2,
                  }}
                >
                  {item.title}
                </Typography>

                <Typography
                  sx={{
                    fontSize: 15,
                    color: '#233857',
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
                  <EmailOutlinedIcon sx={{ fontSize: 22, color: '#5f7fbd' }} />
                  <Link
                    href={`mailto:${item.email}`}
                    underline="hover"
                    sx={{
                      color: '#1f4f8b',
                      fontSize: 15,
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
                    backgroundColor: '#5f7fbd',
                    color: '#fff',
                    textTransform: 'none',
                    alignSelf: 'center',
                    px: 3,
                    py: 1.25,
                    fontSize: 14,
                    '&:hover': {
                      backgroundColor: '#4a6a9e',
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
