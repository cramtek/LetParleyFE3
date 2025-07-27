import { Fade, Popover } from '@mui/material';
import SearchResult from './SearchResult';

const Transition = function Transition({ ref, ...props }) {
  return <Fade ref={ref} {...props} />;
};

const SearchPopover = ({ anchorEl, handleClose }) => {
  const open = Boolean(anchorEl);

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      elevation={3}
      transitionDuration={150}
      slots={{ transition: Transition }}
      slotProps={{
        paper: {
          sx: {
            width: 1,
            maxWidth: { sm: 480 },
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          },
        },
        root: {
          slotProps: {
            backdrop: {
              invisible: false,
            },
          },
        },
      }}
    >
      <SearchResult handleClose={handleClose} />
    </Popover>
  );
};

export default SearchPopover;
