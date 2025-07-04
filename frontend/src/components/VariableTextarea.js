

import { useEffect, useRef, useState } from 'react';
import { VariablePopover } from './VariablePopover';
import { useStore } from '../store';

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
  const [showVariablePopover, setShowVariablePopover] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState(0);
  const { onConnect } = useStore();

  // Auto-resize function
  const autoResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      
      const minHeight = rows * 22;
      const scrollHeight = textarea.scrollHeight;
      const newHeight = Math.max(scrollHeight, minHeight);
      
      textarea.style.height = `${newHeight}px`;
      
      if (onHeightChange && typeof onHeightChange === 'function') {
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

  useEffect(() => {
    const timer = setTimeout(autoResize, 10);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    const timers = [
      setTimeout(autoResize, 0),
      setTimeout(autoResize, 50),
      setTimeout(autoResize, 100)
    ];
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const detectVariablePattern = (text, cursorPos) => {
    const beforeCursor = text.substring(0, cursorPos);
    const lastOpenBrace = beforeCursor.lastIndexOf('{{');
    
    if (lastOpenBrace !== -1) {
      const afterOpenBrace = text.substring(lastOpenBrace);
      const closeBraceIndex = afterOpenBrace.indexOf('}}');
      
      if (closeBraceIndex === -1 || lastOpenBrace + closeBraceIndex > cursorPos) {
        return true;
      }
    }
    return false;
  };

  const getCursorScreenPosition = () => {
    const textarea = textareaRef.current;
    if (!textarea) return { x: 0, y: 0 };

    // Create a temporary element to measure text position
    const tempDiv = document.createElement('div');
    const computedStyle = window.getComputedStyle(textarea);
    
    // Copy textarea styles to temp div
    tempDiv.style.position = 'absolute';
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.whiteSpace = 'pre-wrap';
    tempDiv.style.wordWrap = 'break-word';
    tempDiv.style.fontSize = computedStyle.fontSize;
    tempDiv.style.fontFamily = computedStyle.fontFamily;
    tempDiv.style.lineHeight = computedStyle.lineHeight;
    tempDiv.style.padding = computedStyle.padding;
    tempDiv.style.border = computedStyle.border;
    tempDiv.style.width = computedStyle.width;
    tempDiv.style.boxSizing = computedStyle.boxSizing;
    
    document.body.appendChild(tempDiv);

    // Get text up to cursor position
    const textBeforeCursor = (value || '').substring(0, cursorPosition);
    tempDiv.textContent = textBeforeCursor;
    
    // Create a span for the cursor position
    const cursorSpan = document.createElement('span');
    cursorSpan.textContent = '|';
    tempDiv.appendChild(cursorSpan);
    
    // Get position relative to the temporary div
    const spanRect = cursorSpan.getBoundingClientRect();
    
    document.body.removeChild(tempDiv);
    
    return {
      x: spanRect.left,
      y: spanRect.bottom - 700
    };
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart;
    
    setCursorPosition(cursorPos);
    onChange(newValue);
    
    if (detectVariablePattern(newValue, cursorPos)) {
      const position = getCursorScreenPosition();
      setPopoverPosition(position);
      setShowVariablePopover(true);
    } else {
      setShowVariablePopover(false);
    }
    
    setTimeout(autoResize, 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowVariablePopover(false);
    }
    
    setTimeout(() => {
      setCursorPosition(e.target.selectionStart);
    }, 0);
  };

  const handleSelectionChange = (e) => {
    const cursorPos = e.target.selectionStart;
    setCursorPosition(cursorPos);
    
    if (showVariablePopover) {
      const currentValue = value || '';
      if (!detectVariablePattern(currentValue, cursorPos)) {
        setShowVariablePopover(false);
      }
    }
  };

  const createAutomaticConnection = (inputNode) => {
    const connectionData = {
      source: inputNode.id,
      target: nodeId,
      sourceHandle: `${inputNode.id}-value`,
      targetHandle: `${nodeId}-input`,
      id: `${inputNode.id}-${nodeId}-auto`
    };

    onConnect(connectionData);
  };

  const handleVariableSelect = (node, displayName) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const currentValue = value || '';
    const beforeCursor = currentValue.substring(0, cursorPosition);
    const afterCursor = currentValue.substring(cursorPosition);

    const lastOpenBrace = beforeCursor.lastIndexOf('{{');
    
    if (lastOpenBrace !== -1) {
      const beforeVariable = currentValue.substring(0, lastOpenBrace);
      const newValue = beforeVariable + `{{${displayName}}}` + afterCursor;
      const newCursorPos = beforeVariable.length + displayName.length + 4;
      
      onChange(newValue);
      
      createAutomaticConnection(node);
      
      setTimeout(() => {
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        setCursorPosition(newCursorPos);
      }, 0);
    }
    
    setShowVariablePopover(false);
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
    <>
      <textarea
        ref={textareaRef}
        value={value || ''}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onSelect={handleSelectionChange}
        onClick={handleSelectionChange}
        placeholder={placeholder}
        style={textareaStyle}
        onInput={autoResize}
        {...props}
      />
      
      <VariablePopover
        isVisible={showVariablePopover}
        position={popoverPosition}
        onSelect={handleVariableSelect}
        onClose={() => setShowVariablePopover(false)}
        currentNodeId={nodeId}
      />
    </>
  );
}; 