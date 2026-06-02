import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

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
    <Box sx={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 260,
          backgroundImage: 'url("./assets/contact_us.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.25))',
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
          <Typography sx={{ fontSize: 36, fontWeight: 700 }}>
            Contact Us
          </Typography>
          <Typography sx={{ fontSize: 13, mt: 1 }}>
            Our Teams are here to help
          </Typography>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -6, pb: 6, position: 'relative', zIndex: 2 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          justifyContent="center"
        >
          {contactItems.map((item) => (
            <Card
              key={item.title}
              sx={{
                flex: 1,
                border: '1px solid #002677',
                boxShadow: '0px 0px 8px #196ecf',
                borderRadius: 2,
                minHeight: 280,
              }}
            >
              <CardContent
                sx={{
                  textAlign: 'center',
                  py: 5,
                  px: 4,
                }}
              >
                <Typography
                  sx={{
                    color: '#FF6814',
                    fontWeight: 700,
                    fontSize: 32,
                    mb: 4,
                  }}
                >
                  {item.title}
                </Typography>

                <Typography
                  sx={{
                    fontSize: 16,
                    color: '#222',
                    mb: 4,
                    minHeight: 48,
                  }}
                >
                  {item.text}
                </Typography>

                <Stack spacing={1} alignItems="center">
                  <EmailOutlinedIcon sx={{ fontSize: 56, color: '#000' }} />
                  <Link
                    href={`mailto:${item.email}`}
                    underline="hover"
                    sx={{
                      color: '#000',
                      fontSize: 16,
                      wordBreak: 'break-word',
                    }}
                  >
                    {item.email}
                  </Link>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}