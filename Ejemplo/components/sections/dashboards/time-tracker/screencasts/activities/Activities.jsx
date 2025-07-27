import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useLightbox from 'hooks/useLightbox';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import Lightbox from 'components/base/Lightbox';
import Screenshot from './Screenshot';

const Activities = ({ screencast, isLast }) => {
  const { between } = useBreakpoints();
  const { openLightbox, ...lightboxProps } = useLightbox();
  const { name, avatar, screenshots } = screencast;

  const isBetween = between('sm', 'md');

  const lightboxSlides = screenshots.map((item) => ({
    src: item.screenshot,
    type: 'image',
  }));

  return (
    <Box sx={{ mb: isLast ? 0 : 4 }}>
      <Stack sx={{ mb: 2, alignItems: 'center' }}>
        <Stack sx={{ gap: 1, alignItems: 'center' }}>
          <Tooltip title={name}>
            <Avatar src={avatar} sx={{ height: 32, width: 32 }} />
          </Tooltip>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {name}
          </Typography>
        </Stack>

        <Button
          size="small"
          href="#!"
          sx={{ ml: 'auto' }}
          endIcon={
            <IconifyIcon
              icon="material-symbols:chevron-right-rounded"
              sx={{ fontSize: '18px !important' }}
            />
          }
        >
          View all
        </Button>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
        {screenshots.slice(0, isBetween ? 2 : screenshots.length).map((item, index) => (
          <Screenshot key={item.id} item={item} index={index} openLightbox={openLightbox} />
        ))}
        <Lightbox
          slides={lightboxSlides}
          extension={['caption', 'fullscreen', 'slideshow', 'thumbnails', 'video', 'zoom']}
          {...lightboxProps}
        />
      </Stack>
    </Box>
  );
};

export default Activities;
