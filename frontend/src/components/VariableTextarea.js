// VariableTextarea.js
// Dynamic height textarea component

import { useEffect, useRef, useState } from 'react';

export const VariableTextarea = ({ 
  value, 
  onChange, 
  placeholder, 
  rows = 2,
  nodeId,
  fieldKey,
  style,
  onHeightChange,
  ...props 
}) => {
  const textareaRef = useRef(null);
  const [currentHeight, setCurrentHeight] = useState('auto');

  // Auto-resize function
  const autoResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      
      // Calculate the new height based on content
      const minHeight = rows * 22; // 22px per line (20px line height + 2px spacing)
      const scrollHeight = textarea.scrollHeight;
      const newHeight = Math.max(scrollHeight, minHeight);
      
      // Set the new height
      textarea.style.height = `${newHeight}px`;
      setCurrentHeight(`${newHeight}px`);
      
      // Notify parent about height change if callback provided
      // Use the actual measured height including padding and borders
      if (onHeightChange && typeof onHeightChange === 'function') {
        // Include the textarea's padding and border in the height calculation
        const computedStyle = window.getComputedStyle(textarea);
        const paddingTop = parseInt(computedStyle.paddingTop) || 0;
        const paddingBottom = parseInt(computedStyle.paddingBottom) || 0;
        const borderTop = parseInt(computedStyle.borderTopWidth) || 0;
        const borderBottom = parseInt(computedStyle.borderBottomWidth) || 0;
        
        const totalHeight = newHeight + paddingTop + paddingBottom + borderTop + borderBottom;
        onHeightChange(totalHeight);
      }
    }
  };

  // Auto-resize when content changes
  useEffect(() => {
    // Use a small delay to ensure the DOM has updated
    const timer = setTimeout(autoResize, 10);
    return () => clearTimeout(timer);
  }, [value]);

  // Auto-resize on mount
  useEffect(() => {
    // Multiple attempts to ensure proper sizing
    const timers = [
      setTimeout(autoResize, 0),
      setTimeout(autoResize, 50),
      setTimeout(autoResize, 100)
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Trigger resize immediately and after state update
    setTimeout(autoResize, 0);
  };

  const textareaStyle = {
    width: '100%',
    maxWidth: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    resize: 'none',
    overflow: 'hidden',
    minHeight: `${rows * 22}px`,
    lineHeight: '22px',
    transition: 'height 0.15s ease',
    boxSizing: 'border-box',
    wordWrap: 'break-word',
    wordBreak: 'break-word',
    ...style
  };

  return (
    <textarea
      ref={textareaRef}
      value={value || ''}
      onChange={handleChange}
      placeholder={placeholder}
      style={textareaStyle}
      onInput={autoResize}
      {...props}
    />
  );
}; 