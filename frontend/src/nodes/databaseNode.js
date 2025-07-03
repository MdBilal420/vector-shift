// databaseNode.js
// Database query node using BaseNode abstraction

import { BaseNode } from './BaseNode';

const databaseConfig = {
  title: 'Database',
  width: 220,
  height: 180,
  handles: [
    { type: 'target', position: 'left', id: 'connection', top: '25%' },
    { type: 'target', position: 'left', id: 'query', top: '75%' },
    { type: 'source', position: 'right', id: 'result' },
    { type: 'source', position: 'right', id: 'error', top: '75%' }
  ],
  fields: [
    {
      type: 'select',
      key: 'dbType',
      label: 'Type',
      options: ['PostgreSQL', 'MySQL', 'MongoDB', 'SQLite'],
      defaultValue: 'PostgreSQL'
    },
    {
      type: 'text',
      key: 'host',
      label: 'Host',
      defaultValue: 'localhost',
      placeholder: 'Database host'
    },
    {
      type: 'number',
      key: 'timeout',
      label: 'Timeout (s)',
      defaultValue: 30,
      min: 1,
      max: 300
    }
  ]
};

export const DatabaseNode = ({ id, data }) => {
  return <BaseNode id={id} data={data} config={databaseConfig} />;
}; 