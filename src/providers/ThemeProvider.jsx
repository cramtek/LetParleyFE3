import { useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material';
import RTLMode from 'theme/RTLMode';
import { createTheme } from 'theme/theme.js';
import { useSettingsContext } from './SettingsProvider';

const ThemeProvider = ({ children }) => {
  const {
    config: { textDirection, locale },
  } = useSettingsContext();

  const customTheme = useMemo(() => {
    const theme = createTheme(textDirection, locale);

    return theme;
  }, [textDirection, locale]);

  return (
    <MuiThemeProvider
      disableTransitionOnChange
      theme={customTheme}
      defaultMode="light"
      modeStorageKey="aurora-mode"
    >
      <RTLMode>{children}</RTLMode>
    </MuiThemeProvider>
  );
};

export default ThemeProvider;
