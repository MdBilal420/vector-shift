// inputNode.js
// Refactored to use BaseNode abstraction

import { BaseNode } from './BaseNode';

const inputConfig = {
  title: 'Input',
  description: 'Pass data of different types into your workflow',
  width: 240,
  height: 180,
  handles: [
    { type: 'source', position: 'right', id: 'value' }
  ],
  fields: [
    {
      type: 'text',
      key: 'inputName',
      label: '',
      getDefault: (id) => `input_${id.split('-')[1] || '0'}`,
      placeholder: 'input_0'
    },
    {
      type: 'select',
      key: 'inputType',
      label: 'Type',
      options: ['Text', 'File'],
      defaultValue: 'Text'
    }
  ]
};

export const InputNode = ({ id, data }) => {
  return <BaseNode id={id} data={data} config={inputConfig} />;
};
