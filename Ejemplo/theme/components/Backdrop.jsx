import { cssVarRgba } from 'lib/utils';

const Backdrop = {
  styleOverrides: {
    invisible: {
      backgroundColor: 'transparent',
      backdropFilter: 'none',
    },
    root: ({ theme }) => ({
      backgroundColor: cssVarRgba(theme.vars.palette.grey['950Channel'], 0.2),
      backdropFilter: 'blur(4px)',
    }),
  },
};

export default Backdrop;
