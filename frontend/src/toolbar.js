// toolbar.js

import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {
    const toolbarStyle = {
        background: 'white',
        borderRadius: '12px',
        padding: '16px 24px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
    };

    const containerStyle = {
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        justifyContent: 'flex-start'
    };

    return (
        <div style={toolbarStyle}>
            <div style={containerStyle}>
                <DraggableNode type='customInput' label='Input' />
                <DraggableNode type='customOutput' label='Output' />
                <DraggableNode type='text' label='Text' />
                <DraggableNode type='llm' label='LLM' />
                <DraggableNode type='transform' label='Transform' />
                <DraggableNode type='api' label='CodeExec' />
                <DraggableNode type='database' label='File Save' />
                <DraggableNode type='filter' label='Note' />
                <DraggableNode type='analytics' label='Analytics' />
            </div>
        </div>
    );
};
