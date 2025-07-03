// outputNode.js
// Refactored to use BaseNode abstraction

import { BaseNode } from './BaseNode';

const outputConfig = {
  title: 'Output',
  description: 'Output the results of your workflow',
  width: 240,
  height: 180,
  handles: [
    { type: 'target', position: 'left', id: 'value' }
  ],
  fields: [
    {
      type: 'text',
      key: 'outputName',
      label: '',
      getDefault: (id) => `output_${id.split('-')[1] || '0'}`,
      placeholder: 'output_0'
    },
    {
      type: 'select',
      key: 'outputType',
      label: 'Type',
      options: ['Text', 'Image'],
      defaultValue: 'Text'
    }
  ]
};

export const OutputNode = ({ id, data }) => {
  return <BaseNode id={id} data={data} config={outputConfig} />;
};
