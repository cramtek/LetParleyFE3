import { cssVarRgba } from 'lib/utils';

const projectTimelineChart = (theme) => {
  const { vars } = theme;
  return {
    '& .sg-task.ongoing': {
      backgroundColor: vars.palette.chBlue[100],
      color: `${vars.palette.primary.darker} !important`,
    },
    '& .sg-task.complete': {
      backgroundColor: vars.palette.chGreen[100],
      color: `${vars.palette.success.darker} !important`,
    },
    '& .sg-task.due': {
      backgroundColor: vars.palette.chOrange[100],
      color: `${vars.palette.warning.darker} !important`,
    },
    '& .sg-cell-inner': {
      paddingLeft: '24px !important',
      whiteSpace: 'pre-line',
      fontWeight: 400,
      color: vars.palette.text.secondary,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box !important',
      WebkitLineClamp: '2',
      WebkitBoxOrient: 'vertical',
    },
    '& .sg-foreground': {
      '& .sg-time-range': {
        width: '1px !important',
        backgroundImage: 'none !important',
        backgroundColor: vars.palette.divider,
        transform: 'scaleY(0.94)',
      },
      '& .due .sg-task-background': {
        borderRadius: '4px !important',
        backgroundColor: `${cssVarRgba(vars.palette.warning.lightChannel, 0.15)} !important`,
      },
      '& .complete .sg-task-background': {
        borderRadius: '4px !important',
        backgroundColor: `${vars.palette.chGreen[100]} !important`,
      },
      '& .ongoing .sg-task-background': {
        borderRadius: '4px !important',
        backgroundColor: `${vars.palette.chBlue[100]} !important`,
      },
    },
    '& .sg-table-rows': {
      '& .sg-table-row': {
        position: 'relative',
        '&:before': {
          content: '""',
          position: 'absolute',
          left: 0,
          height: '100%',
          width: '4px',
          backgroundColor: theme.vars.palette.divider,
        },
        '&.task-divider-end:before': {
          top: 0,
          height: '86%',
        },
        '&.task-divider-start:before': {
          bottom: 0,
          height: '86%',
        },
        '&.task-divider-end.task-divider-start:before': {
          height: '80%',
          top: '50%',
          transform: 'translateY(-50%)',
        },
      },
      '& .complete': {
        '&:before': {
          backgroundColor: theme.vars.palette.success.main,
        },
      },
      '& .due': {
        '&:before': {
          backgroundColor: theme.vars.palette.warning.main,
        },
      },
      '& .ongoing': {
        '&:before': {
          backgroundColor: theme.vars.palette.primary.main,
        },
      },
    },
    '& .sg-table-rows .due': {
      '&.due-divider': {
        paddingBottom: '18px',
      },
      '& .sg-tree-expander': {
        backgroundColor: vars.palette.warning.main,
      },
    },
    '& .sg-table-rows .complete': {
      '&.complete-divider': {
        paddingBottom: 0,
      },
      '& .sg-tree-expander': {
        backgroundColor: vars.palette.success.main,
      },
    },
  };
};

export default projectTimelineChart;
