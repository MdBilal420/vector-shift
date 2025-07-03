// llmNode.js
// Refactored to use BaseNode abstraction

import { BaseNode } from './BaseNode';

const llmConfig = {
  title: 'LLM',
  description: 'Process text using large language models',
  width: 240,
  height: 140,
  handles: [
    { type: 'target', position: 'left', id: 'system', top: '30%' },
    { type: 'target', position: 'left', id: 'prompt', top: '70%' },
    { type: 'source', position: 'right', id: 'response', top: '50%' }
  ]
};

export const LLMNode = ({ id, data }) => {
  return <BaseNode id={id} data={data} config={llmConfig} />;
};
