// transformNode.js
// Data transformation node using BaseNode abstraction

import { BaseNode } from './BaseNode';

const transformConfig = {
  title: 'Transform',
  width: 200,
  height: 170,
  handles: [
    { type: 'target', position: 'left', id: 'input' },
    { type: 'source', position: 'right', id: 'output' }
  ],
  fields: [
    {
      type: 'select',
      key: 'operation',
      label: 'Operation',
      options: ['Map', 'Filter', 'Reduce', 'Sort', 'Group'],
      defaultValue: 'Map'
    },
    {
      type: 'textarea',
      key: 'expression',
      label: 'Expression',
      placeholder: 'x => x.toUpperCase()',
      defaultValue: 'x => x',
      rows: 2
    },
    {
      type: 'text',
      key: 'outputKey',
      label: 'Output Key',
      getDefault: (id) => `transformed_${id.split('-')[1]}`,
      placeholder: 'result'
    }
  ]
};

export const TransformNode = ({ id, data }) => {
  return <BaseNode id={id} data={data} config={transformConfig} />;
}; 