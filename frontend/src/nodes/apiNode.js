// apiNode.js
// HTTP API request node using BaseNode abstraction

import { BaseNode } from './BaseNode';

const apiConfig = {
  title: 'API Request',
  width: 240,
  height: 200,
  handles: [
    { type: 'target', position: 'left', id: 'url' },
    { type: 'target', position: 'left', id: 'headers', top: '40%' },
    { type: 'target', position: 'left', id: 'body', top: '80%' },
    { type: 'source', position: 'right', id: 'response' },
    { type: 'source', position: 'right', id: 'status', top: '65%' }
  ],
  fields: [
    {
      type: 'select',
      key: 'method',
      label: 'Method',
      options: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      defaultValue: 'GET'
    },
    {
      type: 'text',
      key: 'endpoint',
      label: 'Endpoint',
      placeholder: 'https://api.example.com/data',
      defaultValue: ''
    },
    {
      type: 'checkbox',
      key: 'followRedirects',
      label: 'Follow redirects',
      defaultValue: true
    },
    {
      type: 'number',
      key: 'retries',
      label: 'Retries',
      defaultValue: 3,
      min: 0,
      max: 10
    }
  ]
};

export const ApiNode = ({ id, data }) => {
  return <BaseNode id={id} data={data} config={apiConfig} />;
}; 