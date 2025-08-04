import { Link, Typography } from '@mui/material';
import Box from '@mui/material/Box';

const LetParleyLogo = ({ showName = true, showFullName = false, sx, ...rest }) => {
  return (
    <Link
      href="/letparley/dashboard"
      underline="none"
      sx={{
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        ...sx,
      }}
      {...rest}
    >
      {/* Logo Image */}
      <Box
        component="img"
        src={showName ? '/LetParley_LogoCompleto.png' : '/LetParley_LogoMinimizado.png'}
        alt="LetParley"
        sx={{
          height: showName ? 32 : 28,
          width: 'auto',
          objectFit: 'contain',
          transition: 'all 0.3s ease',
        }}
      />
      
      {/* Optional Text for additional branding */}
      {showName && showFullName && (
        <Typography
          variant="h6"
          sx={{
            ml: 1,
            fontWeight: 600,
            color: 'text.primary',
            fontSize: '1.1rem',
            letterSpacing: '-0.5px',
          }}
        >
          LetParley
        </Typography>
      )}
    </Link>
  );
};

export default LetParleyLogo;