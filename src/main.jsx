import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import BreakpointsProvider from 'providers/BreakpointsProvider';
import NotistackProvider from 'providers/NotistackProvider';
import SettingsPanelProvider from 'providers/SettingsPanelProvider';
import SettingsProvider from 'providers/SettingsProvider';
import ThemeProvider from 'providers/ThemeProvider';
import SWRConfiguration from 'services/configuration/SWRConfiguration';
import LetParleyApp from './LetParleyApp';
import './locales/i18n';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SWRConfiguration>
      <SettingsProvider>
        <ThemeProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <NotistackProvider>
              <BreakpointsProvider>
                <CssBaseline enableColorScheme />
                <SettingsPanelProvider>
                  <LetParleyApp />
                </SettingsPanelProvider>
              </BreakpointsProvider>
            </NotistackProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </SettingsProvider>
    </SWRConfiguration>
  </React.StrictMode>,
);
