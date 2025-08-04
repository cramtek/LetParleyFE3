import {
  Box,
  Button,
  FormControlLabel,
  InputAdornment,
  Stack,
  Switch,
  TextField,
  Tooltip,
  inputBaseClasses,
} from '@mui/material';
import { useBreakpoints } from '../../../../../providers/BreakpointsProvider';
import { useChatContext } from '../../../../../providers/ChatProvider';
import { FILTER_CONVERSIONS, SEARCH_CONVERSATIONS } from '../../../../../reducers/ChatReducer';
import IconifyIcon from '../../../../../components/base/IconifyIcon';
import FilterMenu from '../filters/FilterMenu';
import SearchFilterMenu from '../filters/SearchFilterMenu';

const SidebarHeader = () => {
  const { chatDispatch, filterBy, searchQuery, handleChatSidebar } = useChatContext();
  const { only } = useBreakpoints();

  const onlySm = only('sm');

  const handleFilter = (value) => {
    chatDispatch({
      type: FILTER_CONVERSIONS,
      payload: value,
    });
  };

  const handleSearch = (event) => {
    chatDispatch({ type: SEARCH_CONVERSATIONS, payload: event.target.value });
  };

  return (
    <Box sx={{ py: 3, px: { xs: 3, sm: 2, md: 5 } }}>
      <Stack
        direction={{ xs: 'row', sm: 'column', md: 'row' }}
        gap={1}
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: { xs: 3, sm: 1, md: 3 },
        }}
      >
        {!onlySm && (
          <FormControlLabel
            control={
              <Switch
                checked={filterBy === 'unread'}
                onChange={(event) => {
                  handleFilter(event.target.checked ? 'unread' : 'all');
                }}
              />
            }
            label="Unread"
            sx={{ gap: 1, m: 0 }}
          />
        )}

        <Stack sx={{ gap: 1 }}>
          <Tooltip title="New message" placement={onlySm ? 'right' : 'top'}>
            <Button
              onClick={() => handleChatSidebar(false)}
              variant="contained"
              color="primary"
              sx={{ minWidth: 'auto', borderRadius: '50%', width: 40, height: 40 }}
            >
              <IconifyIcon
                icon="material-symbols:edit-square-outline-rounded"
                sx={{ fontSize: 18 }}
              />
            </Button>
          </Tooltip>

          {!onlySm && <FilterMenu handleFilter={handleFilter} />}
        </Stack>
      </Stack>

      {onlySm ? (
        <Box sx={{ textAlign: 'center' }}>
          <SearchFilterMenu handleFilter={handleFilter} handleSearch={handleSearch} />
        </Box>
      ) : (
        <TextField
          id="search-box"
          size="small"
          placeholder="Find a conversation"
          fullWidth
          value={searchQuery}
          onChange={handleSearch}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconifyIcon icon="material-symbols:search-rounded" />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            [`& .${inputBaseClasses.root}`]: {
              pl: 2,
            },
          }}
        />
      )}
    </Box>
  );
};

export default SidebarHeader;
