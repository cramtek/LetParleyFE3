import { useEffect, useMemo, useRef } from 'react';
import { isSafari } from 'react-device-detect';
import { useTheme } from '@mui/material';
import { BarChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { tooltipFormatterList } from 'helpers/echart-utils';
import { cssVarRgba } from 'lib/utils';
import { useSettingsContext } from 'providers/SettingsProvider';
import ReactEchart from 'components/base/ReactEchart';

echarts.use([TooltipComponent, GridComponent, BarChart, CanvasRenderer, LegendComponent]);

const TopCampaignsChart = ({ sx, data }) => {
  const chartRef = useRef(null);
  const { vars, typography } = useTheme();
  const { getThemeColor } = useSettingsContext();

  const getOptions = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          shadowStyle: {
            color: cssVarRgba(getThemeColor(vars.palette.chGrey['100Channel']), 0.3),
          },
          z: 1,
        },
        formatter: (params) => tooltipFormatterList(params, false),
      },
      xAxis: {
        type: 'category',
        data: data.map((item) => item.campaign),
        axisLine: {
          lineStyle: {
            color: getThemeColor(vars.palette.dividerLight),
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          rotate: 45,
          margin: 16,
          fontFamily: typography.fontFamily,
          fontSize: typography.subtitle2.fontSize,
          color: getThemeColor(vars.palette.text.secondary),
          fontWeight: 500,
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value) => `${Number(value) / 1000}k`,
          fontFamily: typography.fontFamily,
          fontSize: typography.caption.fontSize,
          color: getThemeColor(vars.palette.text.secondary),
          fontWeight: 400,
        },
        splitLine: {
          lineStyle: {
            color: getThemeColor(vars.palette.dividerLight),
          },
        },
      },
      series: [
        {
          type: 'bar',
          barWidth: 40,
          label: {
            show: false,
          },
          itemStyle: {
            color: getThemeColor(vars.palette.chBlue[200]),
            borderRadius: [8, 8, 0, 0],
          },
          emphasis: {
            itemStyle: {
              color: getThemeColor(vars.palette.chBlue[200]),
            },
          },
          data: data.map((item) => item.users),
        },
      ],
      grid: {
        left: isSafari ? 10 : 0,
        right: 0,
        top: 8,
        bottom: isSafari ? 15 : 0,
        containLabel: true,
      },
    }),
    [vars.palette, getThemeColor, data],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (chartRef.current) {
        const chart = chartRef.current.getEchartsInstance();
        chart.resize();
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return <ReactEchart ref={chartRef} echarts={echarts} option={getOptions} sx={sx} />;
};

export default TopCampaignsChart;
