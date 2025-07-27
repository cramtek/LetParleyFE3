import {
  Avatar,
  AvatarGroup,
  Button,
  Divider,
  List,
  ListItemButton,
  Paper,
  Stack,
  Typography,
  avatarGroupClasses,
} from '@mui/material';
import dayjs from 'dayjs';
import IconifyIcon from 'components/base/IconifyIcon';
import SimpleBar from 'components/base/SimpleBar';

const Greeting = ({ stats, meetingSchedules }) => {
  return (
    <Paper
      background={1}
      component={Stack}
      direction="column"
      divider={<Divider flexItem />}
      sx={{
        gap: 3,
        p: { xs: 3, md: 5 },
        height: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Stack direction="column" spacing={1}>
        <Typography
          variant="subtitle1"
          sx={{
            color: 'text.secondary',
            fontWeight: 500,
          }}
        >
          {dayjs(new Date()).format('dddd, MMM DD, YYYY')}
        </Typography>

        <Typography variant="h6" display="flex" columnGap={1} flexWrap="wrap">
          Good morning,
          <span>Captain!</span>
        </Typography>
      </Stack>

      <div>
        <Typography variant="subtitle2" color="text.secondary" fontWeight={400} mb={2}>
          Updates from yesterday.
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row', md: 'column' }}
          sx={{
            gap: 2,
            justifyContent: 'space-between',
          }}
        >
          {stats.map(({ icon, subtitle, value }) => (
            <Stack
              key={subtitle}
              direction={{ xs: 'row', sm: 'column', md: 'row' }}
              sx={{
                gap: 1,
                flexWrap: 'wrap',
                alignItems: { xs: 'center', sm: 'start', md: 'center' },
                flex: 1,
                px: { sm: 3, md: 0 },
                borderLeft: { sm: 1, md: 'none' },
                borderColor: { sm: 'divider' },
              }}
            >
              <Avatar sx={{ color: 'primary.main', bgcolor: 'primary.lighter' }}>
                <IconifyIcon icon={icon} sx={{ fontSize: 24 }} />
              </Avatar>
              <Stack
                direction={{ xs: 'row', sm: 'column', md: 'row' }}
                sx={{
                  gap: 0.5,
                  flexWrap: 'wrap',
                  alignItems: 'baseline',
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {value}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: 'text.secondary',
                  }}
                >
                  {subtitle}
                </Typography>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </div>

      <Stack direction="column" gap={2} sx={{ flex: 1 }}>
        <Typography
          variant="subtitle2"
          sx={{
            color: 'text.secondary',
            fontWeight: 400,
          }}
        >
          You have 3 meetings today.
        </Typography>

        <SimpleBar sx={{ maxHeight: { xs: 'auto', md: 354 }, height: 'min-content' }}>
          <List
            disablePadding
            component={Stack}
            gap={1}
            direction={{ xs: 'column', sm: 'row', md: 'column' }}
          >
            {meetingSchedules.map(({ title, time, attendants }) => (
              <ListItemButton
                key={title}
                sx={{
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  minWidth: { xs: 0, sm: 254, md: 0 },
                  p: 2,
                  bgcolor: 'background.elevation2',
                  borderRadius: 2,
                  gap: 1,
                  flex: 1,
                  '&:hover': {
                    backgroundColor: 'background.elevation3',
                  },
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    lineClamp: 1,
                  }}
                >
                  {title}
                </Typography>
                <Stack
                  direction={{ xs: 'row', sm: 'column', md: 'row' }}
                  sx={{
                    flex: 1,
                    columnGap: 0.5,
                    rowGap: 1,
                    flexWrap: 'wrap',
                    alignItems: { xs: 'flex-end', sm: 'start', md: 'flex-end' },
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    {time}
                  </Typography>

                  <AvatarGroup
                    max={4}
                    sx={{
                      mr: 1,
                      [`& .${avatarGroupClasses.avatar}`]: {
                        mr: -1.5,
                        width: 24,
                        height: 24,
                        fontSize: '0.6rem',
                        '&:first-of-type': {
                          backgroundColor: 'primary.main',
                        },
                      },
                    }}
                  >
                    {attendants.map((attendant) => (
                      <Avatar alt={attendant.name} key={attendant.name} src={attendant.avatar} />
                    ))}
                  </AvatarGroup>
                </Stack>
              </ListItemButton>
            ))}
          </List>
        </SimpleBar>

        <Button
          variant="text"
          color="primary"
          size="small"
          endIcon={
            <IconifyIcon
              icon="material-symbols:open-in-new-rounded"
              sx={{ height: 18, width: 18 }}
            />
          }
          sx={{ alignSelf: 'flex-end' }}
        >
          Open Schedule
        </Button>
      </Stack>
    </Paper>
  );
};

export default Greeting;
