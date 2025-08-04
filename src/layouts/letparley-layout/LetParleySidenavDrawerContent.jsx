import { useMemo } from 'react';
import { Divider, IconButton, ListSubheader } from '@mui/material';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Toolbar from '@mui/material/Toolbar';
import { useSettingsContext } from '../../providers/SettingsProvider';
import sitemap from '../../routes/sitemap';
import IconifyIcon from '../../components/base/IconifyIcon';
import LetParleyLogo from '../../components/letparley/common/LetParleyLogo';
import { useNavContext } from '../main-layout/NavProvider';
import LetParleyNavItem from './LetParleyNavItem';
import SidenavSimpleBar from '../main-layout/sidenav/SidenavSimpleBar';

const LetParleySidenavDrawerContent = ({ variant = 'permanent' }) => {
  const {
    config: { sidenavCollapsed, openNavbarDrawer, navigationMenuType },
    setConfig,
  } = useSettingsContext();

  const { sidenavAppbarVariant } = useNavContext();

  const expanded = useMemo(
    () => variant === 'temporary' || (variant === 'permanent' && !sidenavCollapsed),
    [sidenavCollapsed, variant],
  );

  const toggleNavbarDrawer = () => {
    setConfig({
      openNavbarDrawer: !openNavbarDrawer,
    });
  };

  return (
    <>
      {/* Logo Section */}
      <Toolbar variant={sidenavAppbarVariant} sx={{ display: 'block', px: { xs: 0 } }}>
        <Box
          sx={[
            {
              height: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            },
            !expanded && {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            },
            expanded && {
              pl: { xs: 4, md: 6 },
              pr: { xs: 2, md: 3 },
            },
          ]}
        >
          {(navigationMenuType === 'sidenav' || variant === 'temporary') && (
            <>
              <LetParleyLogo showName={expanded} />
              <IconButton sx={{ mt: 1, display: { md: 'none' } }} onClick={toggleNavbarDrawer}>
                <IconifyIcon icon="material-symbols:left-panel-close-outline" fontSize={20} />
              </IconButton>
            </>
          )}
        </Box>
      </Toolbar>

      {/* Navigation Content */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <SidenavSimpleBar>
          <Box
            sx={[
              {
                py: 2,
              },
              !expanded && {
                px: 2,
              },
              expanded && {
                px: { xs: 2, md: 4 },
              },
            ]}
          >
            {sitemap.map((menu, index) => (
              <Box key={menu.id}>
                <List
                  dense
                  key={menu.id}
                  sx={{
                    mb: index !== sitemap.length - 1 ? 3 : 0,
                    pb: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                  }}
                  subheader={
                    menu.subheader && (
                      <ListSubheader
                        component="div"
                        disableGutters
                        sx={{
                          textAlign: expanded ? 'left' : 'center',
                          color: 'text.disabled',
                          typography: 'overline',
                          fontWeight: 700,
                          py: 1,
                          paddingLeft: expanded ? 2 : 0,
                          mb: 0.25,
                          position: 'static',
                          background: 'transparent',
                          fontSize: '0.75rem',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {expanded ? menu.subheader : ''}
                      </ListSubheader>
                    )
                  }
                >
                  {menu.items.map((item) => (
                    <LetParleyNavItem key={item.pathName} item={item} level={0} />
                  ))}
                </List>
              </Box>
            ))}
          </Box>
        </SidenavSimpleBar>
      </Box>
    </>
  );
};

export default LetParleySidenavDrawerContent;