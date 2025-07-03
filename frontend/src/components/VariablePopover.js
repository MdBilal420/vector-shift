// VariablePopover.js
// Popover component for selecting variables in text fields

import { useEffect, useRef } from 'react';
import { useStore } from '../store';
import { MdInput } from 'react-icons/md';

export const VariablePopover = ({ 
  isVisible, 
  position, 
  onSelect, 
  onClose,
  currentNodeId 
}) => {
  const { nodes } = useStore();
  const popoverRef = useRef(null);

  // Get available input nodes (excluding current node)
  const getInputNodes = () => {
    return nodes.filter(node => 
      node.type === 'customInput' && node.id !== currentNodeId
    );
  };

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  if (!isVisible) {
    return null;
  }

  const inputNodes = getInputNodes();

  const popoverStyle = {
    position: 'fixed',
    top: position.y,
    left: position.x,
    background: 'white',
    border: '1px solid #6366f1',
    borderRadius: '6px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    zIndex: 9999,
    minWidth: '180px',
    maxWidth: '250px',
    maxHeight: '150px',
    overflowY: 'auto'
  };

  const headerStyle = {
    padding: '6px 10px',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '11px',
    fontWeight: '600',
    color: '#6b7280',
    background: '#f9fafb'
  };

  const menuItemStyle = {
    padding: '8px 10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#374151',
    borderBottom: '1px solid #f3f4f6',
    transition: 'background-color 0.15s ease'
  };

  const hoverStyle = {
    backgroundColor: '#f3f4f6'
  };

  const emptyStyle = {
    padding: '16px 12px',
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: '14px',
    fontStyle: 'italic'
  };

  const handleNodeSelect = (node) => {
    const displayName = node.data.inputName || `input_${node.id.split('-')[1]}`;
    onSelect(node, displayName);
  };

  return (
    <div ref={popoverRef} style={popoverStyle}>
      <div style={headerStyle}>
        Variables ({inputNodes.length})
      </div>
      
      {inputNodes.length === 0 ? (
        <div style={emptyStyle}>
          No input nodes available.<br />
          Add some Input nodes first.
        </div>
      ) : (
        inputNodes.map(node => {
          const displayName = node.data.inputName || `input_${node.id.split('-')[1]}`;
          return (
            <div
              key={node.id}
              style={menuItemStyle}
              onMouseEnter={(e) => Object.assign(e.target.style, hoverStyle)}
              onMouseLeave={(e) => Object.assign(e.target.style, { backgroundColor: 'transparent' })}
              onClick={() => handleNodeSelect(node)}
            >
              <MdInput size={16} color="#6366f1" />
              <span>{displayName}</span>
            </div>
          );
        })
      )}
    </div>
  );
}; 