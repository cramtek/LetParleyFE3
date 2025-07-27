import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Stack,
  Typography,
  dialogClasses,
} from '@mui/material';
import dayjs from 'dayjs';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';

const DeviceDialog = (props) => {
  const { open, handleDialogClose, loggedInDevice, sx } = props;
  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      sx={{
        [`& .${dialogClasses.paper}`]: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          maxWidth: 532,
          width: 1,
          borderRadius: 6,
          overflow: 'visible',
          ...sx,
        },
      }}
    >
      <DialogContent sx={{ p: 3, pr: 0, display: 'flex', gap: 2 }}>
        <Image src={loggedInDevice.icon} width={40} height={40} alt="logged-device-icon" />
        <Stack direction="column" spacing={3} flexGrow={1}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
            <Stack direction="column" spacing={1}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {loggedInDevice.name}
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 400, color: 'text.secondary' }}>
                {loggedInDevice.location}
              </Typography>
            </Stack>
            {loggedInDevice.currentlyLoggedIn && <Chip label="Currently logged in" color="info" />}
          </Stack>
          <Stack direction="column" spacing={1}>
            {loggedInDevice.currentlyLoggedIn ? (
              <Typography variant="subtitle2" sx={{ fontWeight: 400, color: 'text.secondary' }}>
                First logged in at {dayjs(loggedInDevice.firstLoggedTime).format('MMM DD, h:mm a')}
              </Typography>
            ) : (
              <Typography variant="subtitle2">
                Last logged in at {dayjs(loggedInDevice.lastLoggedTime).format('MMM DD, h:mm a')}
              </Typography>
            )}
            {loggedInDevice.currentlyLoggedIn ? (
              <Typography variant="subtitle2" sx={{ fontWeight: 400 }}>
                Recent activity in Bangladesh in the last{' '}
                {dayjs(loggedInDevice.lastLoggedTime).fromNow(true)}
              </Typography>
            ) : (
              <Stack>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 400,
                    color: 'text.secondary',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  Don’t recognize the device?{' '}
                </Typography>
                <Button color="error" size="small" onClick={handleDialogClose}>
                  Click here to log out
                </Button>
              </Stack>
            )}
          </Stack>
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle2" sx={{ fontWeight: 400, color: 'text.secondary' }}>
              Browsers, Apps and Services
            </Typography>
            <Stack direction="column" spacing={0.5}>
              {loggedInDevice.browsersAppsServices?.map((service, _index) => (
                <Typography
                  key={service.name}
                  variant="caption"
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <Image src={service.icon} width={16} height={16} />
                  <span>{service.name}</span>
                </Typography>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ pt: 2, pl: 0, pr: 3 }}>
        <IconButton onClick={handleDialogClose} size="large" sx={{ p: 1, mt: '1px' }}>
          <IconifyIcon icon="material-symbols:close" fontSize={20} />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
};

export default DeviceDialog;
