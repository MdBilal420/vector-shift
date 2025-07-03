// analyticsNode.js
// Data analytics and metrics node using BaseNode abstraction

import { BaseNode } from './BaseNode';

const analyticsConfig = {
  title: 'Analytics',
  width: 200,
  height: 200,
  handles: [
    { type: 'target', position: 'left', id: 'dataset' },
    { type: 'target', position: 'left', id: 'config', top: '70%' },
    { type: 'source', position: 'right', id: 'metrics' },
    { type: 'source', position: 'right', id: 'chart', top: '70%' }
  ],
  fields: [
    {
      type: 'select',
      key: 'metric',
      label: 'Metric',
      options: ['Count', 'Sum', 'Average', 'Min', 'Max', 'Median', 'StdDev'],
      defaultValue: 'Count'
    },
    {
      type: 'text',
      key: 'groupBy',
      label: 'Group By',
      placeholder: 'category, region',
      defaultValue: ''
    },
    {
      type: 'select',
      key: 'chartType',
      label: 'Chart',
      options: ['Bar', 'Line', 'Pie', 'Scatter', 'Histogram'],
      defaultValue: 'Bar'
    },
    {
      type: 'checkbox',
      key: 'realTime',
      label: 'Real-time updates',
      defaultValue: false
    }
  ]
};

export const AnalyticsNode = ({ id, data }) => {
  return <BaseNode id={id} data={data} config={analyticsConfig} />;
}; 