import { Button, Stack, Typography } from '@mui/material';
import promoIllustrationDark from 'assets/images/illustrations/17-dark.webp';
import promoIllustration from 'assets/images/illustrations/17-light.webp';
import Image from 'components/base/Image';

const StorageCTA = () => {
  return (
    <Stack direction="column" gap={2} alignItems="center">
      <Image
        src={{ dark: promoIllustrationDark, light: promoIllustration }}
        sx={{ objectFit: 'contain', width: 128, height: 128 }}
      />

      <Typography variant="subtitle2" sx={{ fontWeight: 500, textAlign: 'center' }}>
        Want to Increase Storage Capacity?
      </Typography>

      <Button variant="contained" color="primary" fullWidth>
        Upgrade
      </Button>
    </Stack>
  );
};

export default StorageCTA;
