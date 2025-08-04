import { Tooltip, Box } from '@mui/material';
import NavItem from '../main-layout/sidenav/NavItem';

const LetParleyNavItem = ({ item, level }) => {
  // If the item is disabled, wrap it in a tooltip and style appropriately
  if (item.disabled) {
    return (
      <Tooltip
        title="Próximamente disponible"
        placement="right"
        arrow
      >
        <Box
          sx={{
            pointerEvents: 'none',
            '& .MuiListItemButton-root': {
              color: 'text.disabled',
              cursor: 'not-allowed',
            },
            '& .MuiListItemIcon-root': {
              color: 'text.disabled',
            },
            '& .MuiListItemText-primary': {
              color: 'text.disabled !important',
            },
          }}
        >
          <NavItem item={item} level={level} />
        </Box>
      </Tooltip>
    );
  }

  // For enabled items, use the regular NavItem
  return <NavItem item={item} level={level} />;
};

export default LetParleyNavItem;