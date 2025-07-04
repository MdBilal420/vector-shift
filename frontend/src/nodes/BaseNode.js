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
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const initialData = {};
    config.fields?.forEach(field => {
      const dataKey = field.key;
      const defaultValue = field.getDefault ? field.getDefault(id) : field.defaultValue;
      initialData[dataKey] = data?.[dataKey] || defaultValue || '';
    });
    setFormData(initialData);
  }, [id, data, config.fields]);

  const handleFieldChange = (fieldKey, value) => {
    const newFormData = { ...formData, [fieldKey]: value };
    setFormData(newFormData);
    updateNodeField(id, fieldKey, value);
  };

  const renderField = (field) => {
    const value = formData[field.key] || '';


    switch (field.type) {
      case 'text':
        return (
          <input
            value={value}
            onChange={(newValue) => {
              console.log('BaseNode field change:', field.key, newValue);
              handleFieldChange(field.key, newValue);
            }}
            placeholder={field.placeholder}
            nodeId={id}
            fieldKey={field.key}
            style={{
              fontWeight: '500',
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              background: '#EEEEFA',
              color: '#6366f1',
              outline: 'none',
              position: 'relative',
              zIndex: 1,
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


  const nodeStyle = {
    width: config.width || 240,
    minHeight: config.height || 140,
    borderRadius: '12px',
    padding: '16px',
    position: 'relative',
    transition: 'all 0.3s ease',
    border: '2px solid #a5b4fc',
    background: 'white',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
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
    lineHeight: '1.4'

  };

  const fieldContainerStyle = {
    marginBottom: '12px'
  };

  const fieldLabelStyle = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '6px',
    display: 'block'
  };

  const handleStyle = {
    width: '12px',
    height: '12px',
    background: 'white',
    border: '2px solid #6366f1',
    borderRadius: '50%'
    
  };

  const getNodeIcon = () => {
    const iconProps = { size: 20, color: '#4338ca' };
    
    const icons = {
      'Input': <MdInput {...iconProps} />,
      'Output': <MdOutput {...iconProps} />,
      'Text': <MdTextSnippet {...iconProps} />,
      'LLM': <LuSparkles {...iconProps} />,
      'Transform': <MdTransform {...iconProps} />,
      'API Request': <MdCode {...iconProps} />,
      'Database': <FaDatabase {...iconProps} />,
      'Filter': <FaFilter {...iconProps} />,
      'Analytics': <MdTransform {...iconProps} />
    };
    return icons[config.title] || <MdInput {...iconProps} />;
  };


  return (
    <div style={nodeStyle} className="fade-in">
      
      {config.handles?.map((handle, index) => (
        <Handle
          key={index}
          type={handle.type}
          position={POSITION_MAP[handle.position]}
          id={`${id}-${handle.id}`}
          style={{
            top: handle.top,
            left: handle.left,
            right: handle.right,
            bottom: handle.bottom,
            ...handleStyle,
            ...handle.style
          }}
        />
      ))}


      <div style={{
        display: 'flex', 
        flexDirection: 'column', 
        padding: '8px', 
        borderRadius: '4px',
        border: '1px solid #e5e7eb', 
        background: '#EEEEFA'
        }}
      >
        <div style={titleStyle}>
          {getNodeIcon()}
          {config.title}
        </div>

        {config.description && (
          <div style={descriptionStyle}>
            {config.description}
          </div>
        )}
      </div>

      {config.fields?.map((field, index) => (
        <div key={field.key} style={fieldContainerStyle}>
          <label style={fieldLabelStyle}>
            {field.label }
          </label>
          {renderField(field)}
        </div>
      ))}
    </div>
  );
}; 