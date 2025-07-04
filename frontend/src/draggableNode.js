// draggableNode.js

import { useState } from 'react';
import { MdInput,MdOutput,MdTextSnippet,MdCode,MdTransform } from "react-icons/md";
import { FaDatabase } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";
import { LuSparkles } from "react-icons/lu";

export const DraggableNode = ({ type, label }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const onDragStart = (event, nodeType) => {
        const appData = { nodeType };
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
        setIsDragging(true);
        
        // Set cursor on document body to ensure it shows during drag
        document.body.style.cursor = 'grabbing';
        event.target.style.opacity = '0.5';
    };

    const onDragEnd = (event) => {
        setIsDragging(false);
        document.body.style.cursor = '';
        event.target.style.opacity = '1';
        event.target.style.cursor = 'grab';
    };

    const getNodeIcon = (type) => {
      const iconProps = { size: 18, color: 'black' };
      
      const icons = {
        customInput: <MdInput {...iconProps} />,
        customOutput: <MdOutput {...iconProps} />,
          text: <MdTextSnippet {...iconProps} />,
        llm: <LuSparkles {...iconProps} />,
        transform: <MdTransform {...iconProps} />,
        api: <MdCode {...iconProps} />,
        database: <FaDatabase {...iconProps} />,
        filter: <FaFilter {...iconProps} />,
        analytics: <MdTransform {...iconProps} />
      };
      return icons[type] || <MdInput {...iconProps} />;
    };

    const getNodeStyle = () => {
     const baseStyle = {
        cursor: isDragging ? 'grabbing' : 'grab',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        padding: '8px 12px',
        borderRadius: '6px',
        transition: isDragging ? 'none' : 'all 0.2s ease',
        background: isHovered && !isDragging ? '#f3f4f6' : 'transparent',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        width: '80px',
        height: '70px',
        userSelect: 'none', // Prevent text selection during drag
        WebkitUserSelect: 'none'
    };

        return baseStyle;
    };

    const iconStyle = {
        marginBottom: '2px',
        pointerEvents: 'none',
        color: 'black',
        backgroundColor: 'white'
    };

    const labelStyle = {  
      fontSize: '12px',
      fontWeight: '500',
      textAlign: 'center',
      pointerEvents: 'none',
      color: 'black'  
    };

    return (
      <div
        className={type}
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={onDragEnd}
        onMouseEnter={() => !isDragging && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={getNodeStyle()}
        draggable
      >
        <div style={iconStyle}>{getNodeIcon(type)}</div>
        <span style={labelStyle}>{label}</span>
      </div>
    );
};
  