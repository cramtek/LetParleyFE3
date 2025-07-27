import { Icon } from '@iconify/react';
import { Box } from '@mui/material';

const IconifyIcon = ({ flipOnRTL = false, ...rest }) => {
  return (
    <Box
      ssr
      component={Icon}
      {...rest}
      sx={[
        flipOnRTL && {
          transform: (theme) => (theme.direction === 'rtl' ? 'rotate(180deg)' : 'none'),
        },
        ...(Array.isArray(rest.sx) ? rest.sx : [rest.sx]),
      ]}
    />
  );
};

export default IconifyIcon;
