import { Tab, tabClasses } from '@mui/material';

const AccountTab = (props) => {
  return (
    <Tab
      {...props}
      sx={{
        px: 3,
        py: 2,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 2,
        borderRadius: 2,
        fontWeight: 700,
        color: 'text.primary',
        bgcolor: 'background.elevation2',
        [`&.${tabClasses.selected}`]: {
          bgcolor: 'background.elevation3',
          color: 'inherit',
        },
        [`& .${tabClasses.icon}`]: {
          mb: 0,
        },
        maxWidth: 1,
        ...props.sx,
      }}
    />
  );
};

export default AccountTab;
