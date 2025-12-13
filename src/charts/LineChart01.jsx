import React, { useRef, useEffect, useState } from 'react';
import { useThemeProvider } from '../utils/ThemeContext';

import { chartColors } from './ChartjsConfig';
import {
  Chart, LineController, LineElement, Filler, PointElement, LinearScale, TimeScale, Tooltip,
} from 'chart.js';
import 'chartjs-adapter-moment';

// Import utilities
import { formatValue } from '../utils/Utils';

Chart.register(LineController, LineElement, Filler, PointElement, LinearScale, TimeScale, Tooltip);

function LineChart01({
  data,
  width,
  height
}) {

  const [chart, setChart] = useState(null)
  const canvas = useRef(null);
  const { currentTheme } = useThemeProvider();
  const darkMode = currentTheme === 'dark';
  const { tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors; 

  useEffect(() => {
    // Don't create chart if data is null or canvas is not available
    if (!data || !canvas.current) {
      if (chart) {
        try {
          chart.destroy();
        } catch (error) {
          // Ignore errors
        }
        setChart(null);
      }
      return;
    }

    const ctx = canvas.current;
    if (!ctx) return;

    // If chart exists, update it instead of recreating
    if (chart) {
      try {
        chart.data = data;
        chart.update();
        return;
      } catch (error) {
        // If update fails, destroy and recreate
        try {
          chart.destroy();
        } catch (destroyError) {
          // Ignore errors
        }
        setChart(null);
      }
    }

    // Create new chart instance
    const newChart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        layout: {
          padding: 20,
        },
        scales: {
          y: {
            display: false,
            beginAtZero: true,
          },
          x: {
            type: 'time',
            time: {
              parser: 'MM-DD-YYYY',
              unit: 'month',
            },
            display: false,
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: () => false, // Disable tooltip title
              label: (context) => formatValue(context.parsed.y),
            },
            bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
            backgroundColor: darkMode ? tooltipBgColor.dark : tooltipBgColor.light,
            borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,
          },
          legend: {
            display: false,
          },
        },
        interaction: {
          intersect: false,
          mode: 'nearest',
        },
        maintainAspectRatio: false,
        resizeDelay: 200,
      },
    });
    setChart(newChart);

    // Cleanup function
    return () => {
      if (newChart) {
        try {
          newChart.destroy();
        } catch (error) {
          // Ignore errors during cleanup
        }
      }
    };
  }, [data, darkMode, tooltipBodyColor, tooltipBgColor, tooltipBorderColor]);

  useEffect(() => {
    if (!chart || !canvas.current) return;

    try {
      if (darkMode) {
        chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.dark;
        chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.dark;
        chart.options.plugins.tooltip.borderColor = tooltipBorderColor.dark;
      } else {
        chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.light;
        chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.light;
        chart.options.plugins.tooltip.borderColor = tooltipBorderColor.light;
      }
      chart.update('none');
    } catch (error) {
      // Ignore errors if chart is being destroyed
      console.warn('Chart update error:', error);
    }
  }, [chart, currentTheme, darkMode, tooltipBodyColor, tooltipBgColor, tooltipBorderColor]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (chart) {
        try {
          chart.destroy();
        } catch (error) {
          // Ignore errors during cleanup
        }
      }
    };
  }, [chart]);

  // Don't render canvas if data is not available
  if (!data) {
    return null;
  }

  return (
    <canvas ref={canvas} width={width} height={height}></canvas>
  );
}

export default LineChart01;