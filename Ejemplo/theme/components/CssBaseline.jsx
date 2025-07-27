import colorPicker from 'theme/styles/colorPicker';
import echart from 'theme/styles/echart';
import emojiMart from 'theme/styles/emojiMart';
import keyFrames from 'theme/styles/keyFrames';
import notistack from 'theme/styles/notistack';
import popper from 'theme/styles/popper';
import prism from 'theme/styles/prism';
import projectTimelineChart from 'theme/styles/projectTimelineChart';
import reactFc from 'theme/styles/react-fc';
import reactDatepicker from 'theme/styles/reactDatepicker';
import scrollbar from 'theme/styles/scrollbar';
import simplebar from 'theme/styles/simplebar';
import svelteGanttChart from 'theme/styles/svelteGanttChart';
import swiper from 'theme/styles/swiper';
import taskTrackChart from 'theme/styles/taskTrackChart';
import vibrantNav from 'theme/styles/vibrantNav';
import yarl from 'theme/styles/yarl';

const CssBaseline = {
  defaultProps: {},
  styleOverrides: (theme) => ({
    body: {
      [`h1, h2, h3, h4, h5, h6, p`]: {
        margin: 0,
      },
      fontVariantLigatures: 'none',
      ...scrollbar(theme),
      [`[id]`]: {
        scrollMarginTop: 82,
      },
    },
    ...simplebar(theme),
    ...swiper(theme),
    ...notistack(theme),
    ...keyFrames(),
    ...prism(),
    ...echart(),
    ...popper(theme),
    ...colorPicker(theme),
    ...reactDatepicker(theme),
    ...vibrantNav(theme),
    ...svelteGanttChart(theme),
    ...projectTimelineChart(theme),
    ...taskTrackChart(theme),
    ...reactFc(theme),
    ...emojiMart(theme),
    ...yarl(theme),
  }),
};

export default CssBaseline;
