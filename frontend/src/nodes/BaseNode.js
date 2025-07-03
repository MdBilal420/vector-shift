// BaseNode.js
// Reusable node abstraction that reduces code duplication

import { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../store';
import { VariableTextarea } from '../components/VariableTextarea';
import { 
  MdInput, 
  MdOutput, 
  MdTextSnippet, 
  MdCode, 
  MdTransform, 
} from 'react-icons/md';
import { FaDatabase } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";

import { LuSparkles } from "react-icons/lu";

const POSITION_MAP = {
  left: Position.Left,
  right: Position.Right,
  top: Position.Top,
  bottom: Position.Bottom
};

export const BaseNode = ({ 
  id, 
  data, 
  config 
}) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const executionState = useStore((state) => state.executionState);
  const [formData, setFormData] = useState({});
  const [dynamicHeight, setDynamicHeight] = useState(null);

  // Get execution status for this node
  const nodeStatus = executionState?.nodeStatus?.[id] || 'pending';
  const nodeResult = executionState?.nodeResults?.[id];

  // Initialize form data with defaults
  useEffect(() => {
    const initialData = {};
    config.fields?.forEach(field => {
      const dataKey = field.key;
      const defaultValue = field.getDefault ? field.getDefault(id) : field.defaultValue;
      initialData[dataKey] = data?.[dataKey] || defaultValue || '';
    });
    setFormData(initialData);
    
    // Reset dynamic height when data changes
    if (config.isDynamic) {
      setDynamicHeight(null);
    }
  }, [id, data, config.fields]);

  // Handle field changes
  const handleFieldChange = (fieldKey, value) => {
    const newFormData = { ...formData, [fieldKey]: value };
    setFormData(newFormData);
    updateNodeField(id, fieldKey, value);
  };

  // Handle height changes from dynamic fields
  const handleHeightChange = (fieldKey, newHeight) => {
    if (config.isDynamic) {
      // Calculate the total height needed for the node
      // Base height includes: padding (32px), title (28px), description (~20px), field label (20px), margins (20px)
      const baseHeight = 16 + 16 + 28 + 20 + 20 + 20; // padding + title + description + label + margins
      const fieldPadding = 24; // padding around the textarea field
      
      // Total height = base + actual textarea height + field padding
      const totalHeight = Math.max(baseHeight + newHeight + fieldPadding, config.minHeight || 140);
      
      setDynamicHeight(totalHeight);
    }
  };

  // Render form field based on type
  const renderField = (field) => {
    const value = formData[field.key] || '';

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              background: '#EEEEFA',
              color: '#8b5cf6',
              fontWeight: '500',
              outline: 'none',
              ...field.style
            }}
          />
        );
      
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              background: 'white',
              color: '#374151',
              outline: 'none',
              ...field.style
            }}
          >
            {field.options.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      case 'textarea':
        return (
          <VariableTextarea
            value={value}
            onChange={(newValue) => {
              handleFieldChange(field.key, newValue);
            }}
            placeholder={field.placeholder}
            rows={field.rows || 2}
            nodeId={id}
            fieldKey={field.key}
            onHeightChange={(newHeight) => handleHeightChange(field.key, newHeight)}
            style={{
              background: 'white',
              color: '#374151',
              ...field.style
            }}
          />
        );
      
      default:
        return null;
    }
  };

  // Dynamic styling based on execution status
  const getStatusStyle = () => {
    switch (nodeStatus) {
      case 'executing':
        return {
          border: '2px solid #f59e0b',
          background: '#fffbeb',
          boxShadow: '0 0 20px rgba(245, 158, 11, 0.3)'
        };
      case 'completed':
        return {
          border: '2px solid #10b981',
          background: '#f0fdf4',
          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)'
        };
      case 'error':
        return {
          border: '2px solid #ef4444',
          background: '#fef2f2',
          boxShadow: '0 2px 8px rgba(239, 68, 68, 0.2)'
        };
      default:
        return {
          border: '2px solid #a5b4fc',
          background: 'white',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        };
    }
  };

  const nodeStyle = {
    width: config.width || 240,
    height: config.isDynamic ? (dynamicHeight || 'auto') : (config.height || config.minHeight || 140),
    minHeight: config.minHeight || 140,
    borderRadius: '12px',
    padding: '16px',
    position: 'relative',
    transition: config.isDynamic ? 'height 0.2s ease' : 'all 0.3s ease',
    overflow: 'hidden',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    ...getStatusStyle(),
    ...config.style
  };

  const titleStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#4338ca',
    ...config.titleStyle
  };

  const descriptionStyle = {
    fontSize: '13px',
    color: '#6b7280',
    marginBottom: '4px',
    lineHeight: '1.4',
    wordWrap: 'break-word'
  };

  const fieldContainerStyle = {
    marginBottom: '12px',
    width: '100%',
    boxSizing: 'border-box'
  };

  const fieldLabelStyle = {
    fontSize: '12px',
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: '4px',
    display: 'block'
  };

  // Render handles
  const renderHandles = () => {
    if (!config.handles) return null;
    
    return config.handles.map((handle, index) => (
      <Handle
        key={index}
        type={handle.type}
        position={POSITION_MAP[handle.position]}
        id={handle.id}
        style={{
          [handle.position]: handle.offset || 0,
          top: handle.top || 'auto',
          bottom: handle.bottom || 'auto',
          background: handle.type === 'source' ? '#6366f1' : '#10b981',
          border: 'none',
          width: '8px',
          height: '8px'
        }}
      />
    ));
  };

  // Get appropriate icon for the node type
  const getNodeIcon = () => {
    const iconProps = { size: 20, color: '#4338ca' };
    
    const icons = {
      'Input': <MdInput {...iconProps} />,
      'Output': <MdOutput {...iconProps} />,
      'Text': <MdTextSnippet {...iconProps} />,
      'LLM': <LuSparkles {...iconProps} />,
      'Transform': <MdTransform {...iconProps} />,
      'CodeExec': <MdCode {...iconProps} />,
      'File Save': <FaDatabase {...iconProps} />,
      'Note': <FaFilter {...iconProps} />,
      'Analytics': <MdTransform {...iconProps} />
    };
    return icons[config.title] || <MdInput {...iconProps} />;
  };

  const StatusIndicator = () => {
    const getStatusInfo = () => {
      switch (nodeStatus) {
        case 'executing':
          return { color: '#f59e0b', text: 'Executing...', pulse: true };
        case 'completed':
          return { color: '#10b981', text: 'Completed', pulse: false };
        case 'error':
          return { color: '#ef4444', text: 'Error', pulse: false };
        default:
          return null;
      }
    };

    const statusInfo = getStatusInfo();
    if (!statusInfo) return null;

    return (
      <div style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: statusInfo.color,
        animation: statusInfo.pulse ? 'pulse 2s infinite' : 'none'
      }} />
    );
  };

  return (
    <div style={nodeStyle}>
      <StatusIndicator />
      {renderHandles()}
      
      <div style={titleStyle}>
        {getNodeIcon()}
        <span>{config.title}</span>
      </div>
      
      {config.description && (
        <div style={descriptionStyle}>
          {config.description}
        </div>
      )}
      
      {config.fields && config.fields.map((field, index) => (
        <div key={field.key || index} style={fieldContainerStyle}>
          {field.label && (
            <label style={fieldLabelStyle}>
              {field.label}
            </label>
          )}
          {renderField(field)}
        </div>
      ))}
      
      {/* Debug: Show execution result */}
      {nodeResult && (
        <div style={{
          marginTop: '8px',
          padding: '6px',
          background: '#f0fdf4',
          border: '1px solid #10b981',
          borderRadius: '4px',
          fontSize: '11px',
          color: '#065f46'
        }}>
          Result: {JSON.stringify(nodeResult).slice(0, 50)}...
        </div>
      )}
    </div>
  );
}; 