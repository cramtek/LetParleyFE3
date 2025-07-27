import { useState } from 'react';
import { Button, Popover, popoverClasses } from '@mui/material';
import twQR from 'assets/images/illustrations/tw-qr.webp';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';

const QRPopover = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleQRClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleQRClose = () => {
    setAnchorEl(null);
  };

  const isQROpen = Boolean(anchorEl);
  const QRId = isQROpen ? 'qr-popover' : undefined;

  return (
    <>
      <Button
        variant="soft"
        color="neutral"
        size="small"
        startIcon={
          <IconifyIcon icon="material-symbols:qr-code-scanner-rounded" fontSize="18px !important" />
        }
        sx={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
        }}
        onClick={handleQRClick}
      >
        Try in your room
      </Button>
      <Popover
        id={QRId}
        open={isQROpen}
        anchorEl={anchorEl}
        onClose={handleQRClose}
        anchorOrigin={{
          vertical: -8,
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        sx={{
          [`& .${popoverClasses.paper}`]: {
            borderRadius: 4,
            p: 3,
          },
        }}
      >
        <Image src={twQR} alt="Themewagon QR" sx={{ width: 164, display: 'block' }} />
      </Popover>
    </>
  );
};

export default QRPopover;
