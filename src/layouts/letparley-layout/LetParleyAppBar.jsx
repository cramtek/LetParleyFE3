import { Box, Button, Stack, Typography, paperClasses } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useBreakpoints } from '../../providers/BreakpointsProvider';
import { useSettingsContext } from '../../providers/SettingsProvider';
import { topnavVibrantStyle } from '../../theme/styles/vibrantNav';
import IconifyIcon from '../../components/base/IconifyIcon';
import VibrantBackground from '../../components/common/VibrantBackground';
import { useLetParleyAuth } from '../../providers/LetParleyAuthProvider';
import { getBusinessNameById } from '../../services/letparley/businessService';
import LetParleyProfileMenu from './LetParleyProfileMenu';

const LetParleyAppBar = () => {
  const {
    config: { drawerWidth, navColor },
    handleDrawerToggle,
  } = useSettingsContext();

  const { selectedBusinessId, authContext, businesses, selectedBusinessName } = useLetParleyAuth();
  const { up } = useBreakpoints();
  const upSm = up('sm');
  const upMd = up('md');

  // Get business name - use cached name or derive from businesses list
  const displayName = selectedBusinessName || getBusinessNameById(businesses, selectedBusinessId);

  return (
    <MuiAppBar
      position="fixed"
      sx={[
        {
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          borderBottom: `1px solid`,
          borderColor: 'divider',
          [`&.${paperClasses.root}`]: {
            outline: 'none',
          },
        },
        navColor === 'vibrant' && !upMd && topnavVibrantStyle,
      ]}
    >
      {navColor === 'vibrant' && !upMd && <VibrantBackground position="top" />}
      <Toolbar variant="appbar" sx={{ px: { xs: 3, md: 5 } }}>
        {/* Mobile Menu Toggle */}
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            alignItems: 'center',
            gap: 1,
            pr: 2,
          }}
        >
          <Button
            color="neutral"
            variant="text"
            onClick={handleDrawerToggle}
            sx={{
              minWidth: 'auto',
              px: 1,
              py: 0.5,
            }}
          >
            <IconifyIcon icon="solar:hamburger-menu-outline" />
          </Button>
          
          {/* Business Name */}
          <Typography
            variant={upSm ? "h6" : "subtitle1"}
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              fontSize: upSm ? '1.25rem' : '1rem',
            }}
          >
            {displayName}
          </Typography>
        </Box>

        {/* Desktop Business Name */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              fontSize: '1.5rem',
            }}
          >
            {displayName}
          </Typography>
        </Box>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />


        {/* Action Items */}
        <Stack direction="row" spacing={1} alignItems="center">
          {/* Notifications (Future feature) */}
          <Button
            color="neutral"
            variant="text"
            disabled
            sx={{
              minWidth: 'auto',
              px: 1,
              py: 0.5,
            }}
          >
            <IconifyIcon icon="solar:bell-outline" />
          </Button>

          {/* Settings (Future feature) */}
          <Button
            color="neutral"
            variant="text"
            disabled
            sx={{
              minWidth: 'auto',
              px: 1,
              py: 0.5,
            }}
          >
            <IconifyIcon icon="solar:settings-outline" />
          </Button>

          {/* Profile Menu */}
          <LetParleyProfileMenu />
        </Stack>
      </Toolbar>
    </MuiAppBar>
  );
};

export default LetParleyAppBar;