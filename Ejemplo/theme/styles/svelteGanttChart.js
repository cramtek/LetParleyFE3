import { useBreakpoints } from 'providers/BreakpointsProvider';

const svelteGanttChart = (theme) => {
  const { vars, typography, direction, transitions } = theme;
  const { down } = useBreakpoints();
  const downSm = down('sm');

  return {
    '& .column-header-row': {
      height: '28px !important',
    },
    '& .column-header-cell': {
      borderRight: direction === 'ltr' ? `1px !important` : `0px !important`,
      borderLeft: direction === 'rtl' ? `1px !important` : `0px !important`,
      borderTop: `0px !important`,
      borderColor: `${vars.palette.divider} !important`,
      borderStyle: 'solid !important',
      borderBottom: `1px solid ${vars.palette.divider} !important`,
      fontWeight: 'bold !important',
      wordSpacing: '5px !important',
      pointerEvents: 'none',
      '&.sticky': {
        justifyContent: 'flex-start !important',
        padding: '0px 8px',
      },
    },
    '& .header-container .column-header-row:nth-of-type(2)': {
      color: `${vars.palette.text.disabled} !important`,
    },
    '& .header-container .column-header-row:nth-of-type(1)': {
      borderTop: `1px solid ${vars.palette.divider} !important`,

      '& .column-header-cell': {
        paddingLeft: '15px !important',
      },
    },
    '& .sg-table': {
      transition: transitions.create(['width'], {
        duration: 300,
        easing: 'ease-in-out',
      }),
      overflow: 'hidden',
    },
    '& .sg-table-cell': {
      padding: '0px !important',
      borderBottom: 'none !important',
    },
    '& .sg-table-body-cell': {
      backgroundColor: `${vars.palette.background.paper} !important`,
      width: downSm ? '90px !important' : '130px !important',
    },
    '& .sg-timeline': {
      marginLeft: '0px !important',
      marginRight: '0px !important',
    },
    '& .sg-table-scroller': {
      marginTop: '0px',
      '& .sg-table-rows': {
        height: '420px !important',
        paddingTop: '10px !important',
      },
    },
    '& .sg-timeline-body': {
      paddingTop: '10px !important',
    },
    '& .sg-gantt': {
      borderBottom: `1px solid ${vars.palette.divider} !important`,
    },
    '& .sg-table-body': {
      paddingBottom: '0px !important',
      borderRight: `1px solid ${vars.palette.divider} !important`,
    },
    '& .sg-task': {
      transition: transitions.create(['all'], {
        duration: 200,
        easing: 'ease-in',
      }),
      borderRadius: '4px !important',
      color: vars.palette.primary.darker,
      backgroundColor: vars.palette.primary.lighter,
      fontSize: typography.subtitle2.fontSize,
      fontWeight: 500,
      opacity: '1 !important',
      display: 'inline-flex !important',
      alignItems: 'center !important',
      border: `1px solid ${vars.palette.neutral.contrastText} !important`,
      marginLeft: '3px !important',
    },
    '& .sg-task-content': {
      width: '100%',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      display: 'inline-block !important',
      position: 'relative !important',
      height: '20px !important',
      userSelect: 'all !important',
      lineHeight: '18.2px',
      paddingLeft: '8px !important',
    },
    '& .sg-tree-expander': {
      minWidth: '4px !important',
      height: '100%',
      backgroundColor: vars.palette.primary.light,
    },
    '& .sg-row': {
      borderBottom: `1px solid ${vars.palette.divider} !important`,
    },
    '& .sg-row:last-of-type': {
      borderBottom: 'none !important',
    },
    '& .sg-resize': {
      zIndex: 0,

      display: 'none',
    },
    '& .sg-table-header': {
      paddingTop: '16px !important',
      paddingLeft: '15px !important',
      backgroundColor: 'transparent !important',
      borderTop: `1px solid ${vars.palette.divider} !important`,
      borderRight: `1px solid ${vars.palette.divider} !important`,
      borderBottom: `1px solid ${vars.palette.divider} !important`,
    },
    '& .sg-table-header-cell': {
      fontWeight: 'bold !important',
      display: 'inline !important',
    },
    '& .sg-header': {
      marginLeft: direction === 'rtl' ? '-5px' : 'unset',
      backgroundColor: vars.palette.background.elevation1,
      color: vars.palette.text.secondary,
      pointerEvents: 'none',
      paddingRight: '0px !important',
    },
  };
};

export default svelteGanttChart;
