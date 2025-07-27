import { useNavigate } from 'react-router';
import { Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import google_logo from 'assets/images/logo/32x32/google.webp';
import microsoft_logo from 'assets/images/logo/32x32/microsoft.webp';
import { OAuthProvider, signInWithPopup } from 'firebase/auth';
import { rootPaths } from 'routes/paths';
import { firebaseAuth, googleProvider, microsoftProvider } from 'services/firebase/firebase';
import Image from 'components/base/Image';

const SocialAuth = () => {
  const navigate = useNavigate();
  return (
    <Grid
      container
      spacing={2}
      sx={{
        alignItems: 'center',
      }}
    >
      <Grid
        size={{
          xs: 12,
          lg: 6,
        }}
      >
        <Button
          fullWidth
          variant="contained"
          color="neutral"
          size="large"
          sx={{ flex: 1, whiteSpace: 'nowrap' }}
          startIcon={<Image src={google_logo} height={21} width={21} alt="icon" />}
          onClick={async () => {
            await signInWithPopup(firebaseAuth, googleProvider);
            navigate(rootPaths.root);
          }}
        >
          Sign in with google
        </Button>
      </Grid>
      <Grid
        size={{
          xs: 12,
          lg: 6,
        }}
      >
        <Button
          fullWidth
          variant="contained"
          color="neutral"
          size="large"
          sx={{ flex: 1, whiteSpace: 'nowrap' }}
          startIcon={<Image src={microsoft_logo} height={21} width={21} alt="icon" />}
          onClick={async () => {
            const res = await signInWithPopup(firebaseAuth, microsoftProvider);
            console.log({ res });
            const credential = OAuthProvider.credentialFromResult(res);
            console.log({ credential });
          }}
        >
          Sign in with Microsoft
        </Button>
      </Grid>
    </Grid>
  );
};

export default SocialAuth;
