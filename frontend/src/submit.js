// submit.js

import { useState } from 'react';
import { useStore } from './store';
import { Snackbar } from './components/Snackbar';

export const SubmitButton = () => {
    const [isExecuting, setIsExecuting] = useState(false);
    const [backendResults, setBackendResults] = useState(null);
    const [error, setError] = useState(null);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarResult, setSnackbarResult] = useState(null);
    
    const { nodes, edges } = useStore();

    // Show snackbar with backend results
    const showBackendSnackbar = (result) => {
        setSnackbarResult(result);
        setShowSnackbar(true);
    };

    // Handle snackbar close
    const handleSnackbarClose = () => {
        setShowSnackbar(false);
        setSnackbarResult(null);
    };

    // Send pipeline data to backend
    const sendToBackend = async (nodes, edges) => {
        try {
            console.log('Sending pipeline to backend...', { nodes: nodes.length, edges: edges.length });
            
            const response = await fetch('http://localhost:8000/pipelines/parse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nodes: nodes,
                    edges: edges
                })
            });

            if (!response.ok) {
                throw new Error(`Backend error: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Backend response:', result);
            
            // Show the snackbar with backend results
            showBackendSnackbar(result);
            
            return result;
        } catch (err) {
            console.error('Backend request failed:', err);
            throw new Error(`Failed to send pipeline to backend: ${err.message}`);
        }
    };

    const handleSubmit = async () => {
        if (nodes.length === 0) {
            alert('Please add some nodes to the pipeline first!');
            return;
        }

        setIsExecuting(true);
        setError(null);
        setBackendResults(null);

        try {
            // Send pipeline to backend and show snackbar
            console.log('Sending pipeline to backend...');
            const backendResponse = await sendToBackend(nodes, edges);
            setBackendResults(backendResponse);
            console.log('Backend analysis completed:', backendResponse);
            
        } catch (err) {
            console.error('Pipeline processing failed:', err);
            setError(err.message);
        } finally {
            setIsExecuting(false);
        }
    };

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '20px',
        padding: '20px',
        gap: '16px'
    };

    const buttonStyle = {
        background: isExecuting ? '#6b7280' : '#6366f1',
        border: 'none',
        borderRadius: '8px',
        color: 'white',
        fontSize: '14px',
        fontWeight: '500',
        padding: '12px 24px',
        cursor: isExecuting ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        minWidth: '140px'
    };

    const hoverStyle = {
        background: '#4f46e5',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
    };

    const errorStyle = {
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '8px',
        padding: '16px',
        color: '#dc2626',
        fontSize: '14px',
        maxWidth: '600px'
    };

    return (
        <>
            <div style={containerStyle}>
                <button 
                    type="submit"
                    style={buttonStyle}
                    onMouseEnter={(e) => {
                        if (!isExecuting) {
                            Object.assign(e.target.style, { ...buttonStyle, ...hoverStyle });
                        }
                    }}
                    onMouseLeave={(e) => {
                        Object.assign(e.target.style, buttonStyle);
                    }}
                    onClick={handleSubmit}
                    disabled={isExecuting}
                >
                    {isExecuting ? 'Analyzing...' : 'Submit Pipeline'}
                </button>

                {/* Error display */}
                {error && (
                    <div style={errorStyle}>
                        <strong>Error:</strong><br />
                        {error}
                    </div>
                )}
            </div>

            {/* Snackbar for pipeline analysis results */}
            <Snackbar
                isVisible={showSnackbar}
                onClose={handleSnackbarClose}
                result={snackbarResult}
                autoHideDuration={6000}
            />
        </>
    );
};
