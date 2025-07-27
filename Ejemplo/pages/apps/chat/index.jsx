import { Stack, Typography } from '@mui/material';
import fallbackIllustrationDark from 'assets/images/illustrations/15-dark.webp';
import fallbackIllustrationLight from 'assets/images/illustrations/15-light.webp';
import Image from 'components/base/Image';

const Chat = () => {
  return (
    <Stack
      sx={{
        p: { xs: 3, md: 5 },
        flex: 1,
        gap: 3,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image
        src={{ dark: fallbackIllustrationDark, light: fallbackIllustrationLight }}
        alt=""
        sx={{ maxWidth: 300, width: 1, display: 'block' }}
      />
      <Typography variant="body2" color="text.secondary" fontWeight={500} textAlign="center">
        Select a conversation to <br /> view its messages
      </Typography>
    </Stack>
  );
};

export default Chat;
