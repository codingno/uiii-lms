import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Card, Stack, Link, Container, Typography } from '@mui/material';
// layouts
import AuthLayout from '../layouts/AuthLayout';
// components
import Page from '../components/Page';
import { MHidden } from '../components/@material-extend';
import LoginForm from '../components/authentication/login/LoginFormLms';
import AuthSocial from '../components/authentication/AuthSocial';
import { mockImgCover } from '../utils/mockImages';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  },
  backgroundImage: `url(${mockImgCover('uiii_bg')})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover'
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2)
}));

const ContentStyle = styled('div')(({ theme }) => ({
  // maxWidth: 480,
  maxWidth: '100%',
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

const FormStyle = styled('div')(({ theme }) => ({
  // maxWidth: 464,
  maxWidth: '100%',
  display: 'flex',
  flexDirection: 'rows',
  justifyContent: 'space-around',
  padding: theme.spacing(5, 5),
  borderRadius: '16px',
  // backgroundColor: 'white'
}));
// ----------------------------------------------------------------------

export default function Login() {
  return (
    <RootStyle title="Login | UIII LMS">
      <AuthLayout>
        <Typography sx={{ color: 'white' }}>Don’t have an account? &nbsp;</Typography>
        <Link
          underline="none"
          variant="subtitle2"
          component={RouterLink}
          to="/register"
          sx={{ color: '#E3A130' }}
        >
          Get started
        </Link>
      </AuthLayout>

      {/* <MHidden width="mdDown">
        <SectionStyle>
          <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
            Hi, Welcome Back
          </Typography>
          <img src="/static/illustrations/illustration_login.png" alt="login" />
        </SectionStyle>
      </MHidden> */}

      <Container maxWidth="lg">
        <ContentStyle>
          <FormStyle>
            <Stack sx={{ mb: 5 }}>
          		<img src="/static/white-uiii.png" alt="login-logo" />
              {/* <Typography variant="h3" sx={{ px: 0, mt: 0, mb: 5, color: '#003B5C' }}>
                UIII Learning Management System
              </Typography>
              <Typography variant="h4" gutterBottom>
                Sign in to ULMS
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>Enter your details below.</Typography> */}
            </Stack>
            {/* <AuthSocial /> */}

            <LoginForm />

            <MHidden width="smUp">
              <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                Don’t have an account?&nbsp;
                <Link variant="subtitle2" component={RouterLink} to="register">
                  Get started
                </Link>
              </Typography>
            </MHidden>
          </FormStyle>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
