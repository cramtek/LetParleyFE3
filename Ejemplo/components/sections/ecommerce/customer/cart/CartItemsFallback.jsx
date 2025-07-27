import { Button, Stack, Typography } from '@mui/material';
import illustration11dark from 'assets/images/illustrations/11-dark.webp';
import illustration11 from 'assets/images/illustrations/11-light.webp';
import paths from 'routes/paths';
import Image from 'components/base/Image';

const CartItemsFallback = ({ handleDrawerClose }) => {
  return (
    <Stack
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        height: 1,
        textAlign: 'center',
      }}
    >
      <div>
        <Image
          src={{ light: illustration11, dark: illustration11dark }}
          alt="cart"
          width={270}
          sx={{ mb: 5 }}
        />
        <Typography
          variant="h3"
          sx={{
            mb: 1,
          }}
        >
          Nothing here yet
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mb: 5,
          }}
        >
          Add items to get started
        </Typography>
        <Button variant="contained" href={paths.products} onClick={handleDrawerClose}>
          Start exploring
        </Button>
      </div>
    </Stack>
  );
};

export default CartItemsFallback;
