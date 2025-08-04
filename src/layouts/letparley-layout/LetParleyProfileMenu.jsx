import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Box,
  Button,
  Divider,
  ListItemIcon,
  MenuItem,
  Stack,
  Switch,
  Typography,
  listClasses,
  listItemIconClasses,
  paperClasses,
} from '@mui/material';
import Menu from '@mui/material/Menu';
import { useThemeMode } from '../../hooks/useThemeMode';
import { useLetParleyAuth } from '../../providers/LetParleyAuthProvider';
import { useBreakpoints } from '../../providers/BreakpointsProvider';
import { useSettingsContext } from '../../providers/SettingsProvider';
import IconifyIcon from '../../components/base/IconifyIcon';
import StatusAvatar from '../../components/base/StatusAvatar';

const LetParleyProfileMenu = ({ type = 'default' }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const { up } = useBreakpoints();
  const upSm = up('sm');
  const {
    config: { textDirection },
  } = useSettingsContext();

  const { isDark, setThemeMode } = useThemeMode();
  const { userEmail, signOut, selectedBusinessId } = useLetParleyAuth();

  // Create user object from LetParley auth data
  const user = useMemo(() => ({
    name: userEmail?.split('@')[0] || 'Usuario',
    email: userEmail || 'usuario@ejemplo.com',
    avatar: null, // LetParley doesn't have user avatars yet
    role: 'Usuario LetParley',
  }), [userEmail]);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    handleClose();
    await signOut();
    navigate('/letparley/auth/login', { replace: true });
  };

  const handleSwitchBusiness = () => {
    handleClose();
    navigate('/letparley/select-business', { replace: true });
  };

  const handleAccount = () => {
    handleClose();
    // Future: navigate to account settings
    console.log('Navigate to account settings (future feature)');
  };

  return (
    <>
      <Button
        id="profile-menu-button"
        aria-controls={open ? 'profile-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{
          px: 1,
          py: 0.5,
          minWidth: 'auto',
          color: 'text.secondary',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <StatusAvatar
          src={user.avatar}
          alt={user.name}
          status="online"
          sx={{ width: 32, height: 32 }}
        />
        {upSm && type === 'default' && (
          <Box sx={{ ml: 1.5, textAlign: textDirection === 'rtl' ? 'right' : 'left' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
              {user.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
              {user.role}
            </Typography>
          </Box>
        )}
        <IconifyIcon
          icon="solar:alt-arrow-down-outline"
          sx={{
            ml: upSm && type === 'default' ? 1 : 0.5,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        />
      </Button>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'profile-menu-button',
        }}
        slotProps={{
          paper: {
            sx: {
              width: 280,
              [`&.${paperClasses.root}`]: {
                mt: 1.5,
              },
              [`& .${listClasses.root}`]: {
                py: 0,
              },
              [`& .${listItemIconClasses.root}`]: {
                minWidth: 36,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* User Profile Header */}
        <Box sx={{ p: 2 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <StatusAvatar
              src={user.avatar}
              alt={user.name}
              status="online"
              sx={{ width: 48, height: 48 }}
            />
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {user.email}
              </Typography>
              {selectedBusinessId && (
                <Typography variant="caption" color="primary.main">
                  Negocio seleccionado: {selectedBusinessId}
                </Typography>
              )}
            </Box>
          </Stack>
        </Box>

        <Divider />

        {/* Menu Items */}
        <MenuItem onClick={handleAccount} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <IconifyIcon icon="solar:user-bold" />
          </ListItemIcon>
          <Typography variant="body2">Mi Cuenta</Typography>
        </MenuItem>

        <MenuItem onClick={handleSwitchBusiness} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <IconifyIcon icon="solar:buildings-2-bold" />
          </ListItemIcon>
          <Typography variant="body2">Cambiar Negocio</Typography>
        </MenuItem>

        <Divider />

        {/* Theme Toggle */}
        <MenuItem sx={{ py: 1.5 }}>
          <ListItemIcon>
            <IconifyIcon icon={isDark ? 'solar:moon-bold' : 'solar:sun-bold'} />
          </ListItemIcon>
          <Typography variant="body2" sx={{ flexGrow: 1 }}>
            Modo {isDark ? 'Oscuro' : 'Claro'}
          </Typography>
          <Switch
            checked={isDark}
            onChange={(event) => setThemeMode(event.target.checked ? 'dark' : 'light')}
            size="small"
          />
        </MenuItem>

        <Divider />

        {/* Sign Out */}
        <MenuItem onClick={handleSignOut} sx={{ py: 1.5, color: 'error.main' }}>
          <ListItemIcon>
            <IconifyIcon icon="solar:logout-3-bold" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <Typography variant="body2">Cerrar Sesión</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default LetParleyProfileMenu;