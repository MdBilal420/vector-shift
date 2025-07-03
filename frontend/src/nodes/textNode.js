// textNode.js
// Refactored to use BaseNode abstraction with dynamic height

import { BaseNode } from './BaseNode';

const textConfig = {
  title: 'Text',
  description: 'Add static text or variables to your workflow',
  width: 240,
  minHeight: 140, // Use minHeight instead of fixed height
  isDynamic: true, // Flag to indicate this node has dynamic height
  handles: [
    { type: 'target', position: 'left', id: 'input', top: '50%' },
    { type: 'source', position: 'right', id: 'output', top: '50%' }
  ],
  fields: [
    {
      type: 'textarea',
      key: 'text',
      label: 'Text',
      defaultValue: 'Hello world',
      placeholder: 'Enter your text here...',
      rows: 3,
      isDynamic: true // Flag to indicate this field affects node height
    }
  ]
};

export const TextNode = ({ id, data }) => {
  return <BaseNode id={id} data={data} config={textConfig} />;
};
