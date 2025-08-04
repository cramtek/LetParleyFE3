import { Box } from '@mui/material';

const ResizableSidebar = ({ children }) => {
  return (
    <Box
      sx={{
        width: { xs: '100%', md: 340, lg: 404 },
        maxWidth: { md: '50%', xl: 'calc(100% - 824px)' },
        minWidth: { md: 340, lg: 404 },
        height: '100%',
        borderRight: 1,
        borderColor: 'divider',
      }}
    >
      {children}
    </Box>
  );
};

export default ResizableSidebar;
