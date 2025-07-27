import { Alert, AlertTitle, Link } from '@mui/material';
import Code from 'components/base/Code';
import IconifyIcon from 'components/base/IconifyIcon';

export const changelog = [
  {
    version: 'V1.3.1',
    title: 'Frostbite',
    publish: '29 June, 2025',
    badgeTitle: 'Latest',
    logs: {
      Fixes: [
        {
          text: (
            <>
              Dependency Conflicts: Resolved <Code>@mui/icons-material</Code> peer dependency
              mismatch with <Code>@mui/material</Code>.
            </>
          ),
        },
        {
          text: (
            <>
              TipTap Compatibility: Upgraded all <Code>@tiptap/*</Code> packages to{' '}
              <Code>^2.23.0</Code> to fix build error caused by missing <Code>canInsertNode</Code>{' '}
              export.
            </>
          ),
        },
        {
          text: (
            <>
              Added <Code>^</Code> to all package versions in <Code>package.json</Code> to allow
              future minor and patch updates.
            </>
          ),
        },
      ],
    },
  },
  {
    version: 'V1.3.0',
    title: 'CyberNova',
    publish: '19 June, 2025',
    badgeTitle: 'Latest',
    warning: (
      <Alert
        severity="info"
        icon={<IconifyIcon icon="material-symbols:info-outline" />}
        sx={{ mb: 2 }}
      >
        <AlertTitle>Important Update</AlertTitle>
        Now compatible with <strong>React 19</strong> and <strong>Material UI v7</strong>. Please
        refer to the{' '}
        <Link
          href="https://react.dev/blog/2024/04/25/react-19-upgrade-guide"
          target="_blank"
          underline="hover"
        >
          Upgrade Guide
        </Link>{' '}
        for migration steps.
      </Alert>
    ),
    logs: {
      Updates: [
        {
          text: (
            <>
              Added <Code>React 19</Code> compatibility with <Code>Material UI v7</Code>
            </>
          ),
        },
        {
          text: (
            <>
              Removed the <Code>forwardRef</Code> and adjusted the types support.
            </>
          ),
        },

        {
          text: (
            <>
              Upgraded to <Code>React Router v7</Code>
            </>
          ),
          link: {
            href: 'https://reactrouter.com/upgrading/v6#upgrade-to-v7',
            linkText: 'See Migration Guide',
          },
        },
        {
          text: 'Updated all third-party packages to their latest stable and compatible versions',
        },
        {
          text: 'Refactored Suspense boundaries to align with React Router’s dynamic fallback handling',
        },
      ],
      Fixes: [
        {
          text: 'Minor UI and behavior bugs fix and performance improvements',
        },
      ],
    },
  },
  {
    version: 'V1.2.0',
    title: 'Stormforge',
    publish: '04 June, 2025',
    warning: (
      <Alert
        severity="info"
        icon={<IconifyIcon icon="material-symbols:info-outline" />}
        sx={{ mb: 2 }}
      >
        <AlertTitle>Important Theme System Update</AlertTitle>
        This version introduces CSS variables for all theme values. Please see the{' '}
        <Link href="/documentation/theming#css-variable-upgrade-guide" underline="hover">
          Upgrade Guide
        </Link>{' '}
        for migration instructions and breaking changes.
      </Alert>
    ),
    logs: {
      New: [
        { text: 'Dashboard', link: '/dashboard/time-tracker' },
        { text: 'App', link: '/file-manager' },
        { text: 'App', link: '/apps/calendar' },
        { text: 'App', link: '/apps/scheduler' },
        { text: 'New Account pages', link: '/account' },
        {
          text: 'Migrating to CSS variable-based theming',
          link: {
            href: '/documentation/theming#css-variable-upgrade-guide',
            linkText: 'CSS variable upgrade guide',
          },
        },
        {
          text: (
            <>
              New <Code>ColorPicker</Code> component for selecting and formatting colors with alpha
              transparency
            </>
          ),
        },
        {
          text: (
            <>
              Package: <Code>@uiw/react-color</Code>
            </>
          ),
        },
        {
          text: (
            <>
              Package: <Code>react-device-detect</Code>
            </>
          ),
        },
      ],
      Features: [
        {
          text: (
            <>
              Added support for <Code>theme.vars</Code> in all MUI components for color and spacing
              tokens
            </>
          ),
        },
        {
          text: (
            <>
              Introduced <Code>cssVarRgba()</Code> utility for alpha transparency with full variable
              support
            </>
          ),
        },
      ],
      Updates: [
        {
          text: (
            <>
              Refactored dark mode logic to use <Code>useThemeMode()</Code> for consistent theme
              detection
            </>
          ),
        },
        {
          text: (
            <>
              Replaced <Code>alpha()</Code> usage with <Code>cssVarRgba()</Code> to improve SSR and
              runtime compatibility
            </>
          ),
        },
        {
          text: (
            <>
              Used <Code>getThemeColor()</Code> utility to resolve CSS variable-based colors at
              runtime in all ECharts
            </>
          ),
        },
        {
          text: 'Updated deprecated MUI component APIs',
          link: {
            href: 'https://mui.com/material-ui/migration/migrating-from-deprecated-apis/',
            linkText: 'Migration Guide',
          },
        },
        {
          text: (
            <>
              <Code>svelte-gantt</Code>: Upgraded to v4.5.0
            </>
          ),
        },
      ],
      Fixes: [
        {
          text: 'Fixed theme mode switch flickering issue',
        },
        {
          text: 'Fixed issue related to threadline not appearing in some browsers in the Social app',
        },
        { text: 'Fixed various RTL and browser compatibility issues' },
      ],
    },
  },
  {
    version: 'V1.1.0',
    title: 'Frostbeam',
    publish: '29 April, 2025',
    logs: {
      New: [
        { text: 'Dashboard', link: '/dashboard/analytics' },
        { text: 'Dashboard', link: '/dashboard/hrm' },
        { text: 'App', link: '/apps/social' },
        { text: 'Page', link: '/crm/deals' },
        { text: 'Page', link: '/crm/lead-details' },
        { text: 'Page', link: '/crm/deal-details' },
        { text: 'Page', link: '/crm/add-contact' },
        { text: 'Page', link: '/pricing/table' },
        { text: 'Page', link: '/ecommerce/admin/create-order' },
      ],
      Features: [
        { text: 'Added support for documentation search' },
        { text: 'New starter templates available for JavaScript and TypeScript' },
      ],
      Fixes: [
        { text: 'Resolved some RTL issues' },
        { text: 'Improved mobile responsiveness' },
        { text: 'Kanban: Items can be dragged properly in compact mod' },
      ],
      Updates: [
        { text: '@mui/material: Upgraded to v7.0.2' },
        { text: '@mui/system: Upgraded to v7.0.2' },
        { text: '@mui/utils: Upgraded to v7.0.2' },
        { text: '@mui/x-data-grid: Upgraded to v8.0.0' },
        { text: '@mui/x-date-pickers: Upgraded to v8.0.0' },
        { text: 'Updated component docs' },
      ],
    },
  },
];
