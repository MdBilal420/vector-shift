// Snackbar.js
// Beautiful snackbar component for displaying pipeline analysis results

import { useState, useEffect } from 'react';

export const Snackbar = ({ 
  isVisible, 
  onClose, 
  result, 
  autoHideDuration = 5000 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      
      // Auto-hide after specified duration
      const timer = setTimeout(() => {
        handleClose();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoHideDuration]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation to complete
  };

  if (!isVisible) return null;

  const { num_nodes, num_edges, is_dag } = result || {};

  const getSnackbarStyle = () => {
    const baseStyle = {
      position: 'fixed',
      top: '20px',
      right: '20px',
      minWidth: '350px',
      maxWidth: '500px',
      padding: '16px 20px',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
      zIndex: 1000,
      transform: isAnimating ? 'translateX(0)' : 'translateX(100%)',
      opacity: isAnimating ? 1 : 0,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    };

    // Color scheme based on DAG status
    if (is_dag) {
      return {
        ...baseStyle,
        background: 'linear-gradient(135deg, #10b981, #059669)',
        color: 'white'
      };
    } else {
      return {
        ...baseStyle,
        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
        color: 'white'
      };
    }
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  };

  const titleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    margin: 0
  };

  const closeButtonStyle = {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    transition: 'background 0.2s'
  };

  const contentStyle = {
    fontSize: '14px',
    lineHeight: '1.5'
  };

  const statsStyle = {
    display: 'flex',
    gap: '16px',
    marginTop: '8px',
    marginBottom: '8px'
  };

  const statItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  };

  const statusMessageStyle = {
    marginTop: '8px',
    fontSize: '13px',
    opacity: 0.9
  };

  return (
    <div style={getSnackbarStyle()}>
      <div style={headerStyle}>
        <h4 style={titleStyle}>Pipeline Analysis</h4>
        <button 
          style={closeButtonStyle}
          onClick={handleClose}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          ×
        </button>
      </div>
      
      <div style={contentStyle}>
        <div style={statsStyle}>
          <div style={statItemStyle}>
            <span>📊</span>
            <span><strong>{num_nodes}</strong> nodes</span>
          </div>
          <div style={statItemStyle}>
            <span>🔗</span>
            <span><strong>{num_edges}</strong> edges</span>
          </div>
          <div style={statItemStyle}>
            <span>{is_dag ? '✅' : '❌'}</span>
            <span><strong>{is_dag ? 'Valid DAG' : 'Invalid DAG'}</strong></span>
          </div>
        </div>
        
        <div style={statusMessageStyle}>
          {is_dag ? 
            'Great! Your pipeline is a valid Directed Acyclic Graph and can be executed.' : 
            'Warning: Your pipeline contains cycles and may not execute properly.'
          }
        </div>
      </div>
    </div>
  );
}; 