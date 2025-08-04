import { useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { Drawer, drawerClasses } from '@mui/material';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import clsx from 'clsx';
import { mainDrawerWidth } from '../../lib/constants';
import { useSettingsContext } from '../../providers/SettingsProvider';
import { sidenavVibrantStyle } from '../../theme/styles/vibrantNav';
import VibrantBackground from '../../components/common/VibrantBackground';
import NavProvider from '../main-layout/NavProvider';
import Footer from '../main-layout/footer';
import LetParleySidenavDrawerContent from './LetParleySidenavDrawerContent';
import SlimSidenav from '../main-layout/sidenav/SlimSidenav';
import StackedSidenav from '../main-layout/sidenav/StackedSidenav';
import LetParleySidenav from './LetParleySidenav';
import LetParleyAppBar from './LetParleyAppBar';

/**
 * LetParley Layout that integrates with Aurora template structure
 * This provides the LetParley-customized sidebar, topbar, and main content area
 */
const LetParleyLayout = () => {
  const {
    config: {
      drawerWidth,
      sidenavType,
      navigationMenuType,
      openNavbarDrawer,
      navColor,
    },
    setConfig,
  } = useSettingsContext();

  const toggleNavbarDrawer = () => {
    setConfig({
      openNavbarDrawer: !openNavbarDrawer,
    });
  };

  const toolbarVariant = useMemo(() => {
    return 'appbar'; // Always use default appbar for LetParley
  }, []);

  return (
    <Box>
      <Box
        className={clsx({
          'nav-vibrant': navColor === 'vibrant',
        })}
        sx={{ display: 'flex', zIndex: 1, position: 'relative' }}
      >
        <NavProvider>
          {/* LetParley Custom AppBar */}
          <LetParleyAppBar />

          {/* LetParley Sidebar Navigation */}
          {(navigationMenuType === 'sidenav' || navigationMenuType === 'combo') && (
            <>
              {sidenavType === 'default' && <LetParleySidenav />}
              {sidenavType === 'slim' && <SlimSidenav />}
              {sidenavType === 'stacked' && <StackedSidenav />}
            </>
          )}

          {/* Mobile Drawer */}
          <Drawer
            variant="temporary"
            open={openNavbarDrawer}
            onClose={toggleNavbarDrawer}
            ModalProps={{
              keepMounted: true,
            }}
            sx={[
              {
                display: { xs: 'block', md: 'none' },
                [`& .${drawerClasses.paper}`]: {
                  pt: 3,
                  boxSizing: 'border-box',
                  width: mainDrawerWidth.full,
                },
              },
              navColor === 'vibrant' && sidenavVibrantStyle,
            ]}
          >
            {navColor === 'vibrant' && <VibrantBackground position="side" />}
            <LetParleySidenavDrawerContent variant="temporary" />
          </Drawer>

          {/* Main Content Area */}
          <Box
            component="main"
            sx={[
              {
                flexGrow: 1,
                p: 0,
                minHeight: '100vh',
                width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
                display: 'flex',
                flexDirection: 'column',
              },
              sidenavType === 'default' && {
                ml: { md: `${mainDrawerWidth.collapsed}px`, lg: 0 },
              },
              sidenavType === 'stacked' && {
                ml: { md: `${mainDrawerWidth.stackedNavCollapsed}px`, lg: 0 },
              },
              sidenavType === 'slim' && {
                ml: { xs: 0 },
              },
            ]}
          >
            <Toolbar variant={toolbarVariant} />

            <Box sx={{ flex: 1 }}>
              <Box
                sx={[
                  {
                    height: 1,
                    bgcolor: 'background.default',
                  },
                ]}
              >
                <Outlet />
              </Box>
            </Box>
            <Footer />
          </Box>
        </NavProvider>
      </Box>
    </Box>
  );
};

export default LetParleyLayout;