import { Box, Paper, Stack, Typography } from '@mui/material';
import illustration9dark from 'assets/images/illustrations/9-dark.webp';
import illustration9 from 'assets/images/illustrations/9-light.webp';

const Promo = ({ title, subtitle }) => {
  return (
    <Paper
      sx={{
        p: { xs: 3, md: 5 },
        height: 1,
      }}
    >
      <Box
        sx={{
          width: 1,
          height: 1,
          minHeight: { xs: 300, md: 260 },
          borderRadius: 3,
          overflow: 'hidden',
          background: `linear-gradient(90deg, rgba(153, 220, 196, 0.50) 0%, rgba(153, 220, 196, 0.00) 33.33%, rgba(153, 220, 196, 0.50) 66.67%, rgba(153, 220, 196, 0.00) 100%);`,
          backgroundSize: '300% 100%',
          animation: `linearLeftToRight 9s linear infinite`,
        }}
      >
        <Stack
          direction="column"
          sx={(theme) => ({
            justifyContent: 'flex-start',
            rowGap: 2,
            backgroundImage: `url(${illustration9})`,
            backgroundSize: 'calc(max(100%, 904px)) 100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: ({ direction }) =>
              direction === 'rtl' ? 'right 14px' : 'left 14px',
            padding: 4,
            height: 1,
            ...theme.applyStyles('dark', {
              backgroundImage: `url(${illustration9dark})`,
            }),
          })}
        >
          <div>
            <Typography
              sx={{
                color: 'success.dark',
                mb: 0.5,
                typography: { xs: 'h6', lg: 'h5' },
              }}
            >
              {title}
            </Typography>
            <Typography
              sx={{
                color: 'success.dark',
                typography: { xs: 'h3', lg: 'h2', xl: 'h1' },
              }}
            >
              {subtitle}
            </Typography>
          </div>
        </Stack>
      </Box>
    </Paper>
  );
};

export default Promo;
