// filterNode.js
// Data filtering node using BaseNode abstraction

import { BaseNode } from './BaseNode';

const filterConfig = {
  title: 'Filter',
  width: 210,
  height: 170,
  handles: [
    { type: 'target', position: 'left', id: 'data' },
    { type: 'target', position: 'left', id: 'condition', top: '70%' },
    { type: 'source', position: 'right', id: 'filtered' },
    { type: 'source', position: 'right', id: 'rejected', top: '70%' }
  ],
  fields: [
    {
      type: 'select',
      key: 'operator',
      label: 'Operator',
      options: ['equals', 'contains', 'startsWith', 'endsWith', 'greaterThan', 'lessThan'],
      defaultValue: 'equals'
    },
    {
      type: 'text',
      key: 'field',
      label: 'Field',
      placeholder: 'property.name',
      defaultValue: ''
    },
    {
      type: 'text',
      key: 'value',
      label: 'Value',
      placeholder: 'comparison value',
      defaultValue: ''
    }
  ]
};

export const FilterNode = ({ id, data }) => {
  return <BaseNode id={id} data={data} config={filterConfig} />;
}; 