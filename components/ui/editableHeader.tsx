import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  editable?: boolean;
  input?:string
  State?:any
}

const EditHeader = ({ className, children, level = 1, editable = true,State,input, ...props }: HeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(input as string);

  const headerClasses = [
    'text-5xl font-semibold leading-10',
    'text-2xl font-semibold leading-6',
    'text-xl font-semibold',
    'text-lg font-semibold',
    'text-base font-semibold',
    'text-sm font-semibold',
  ];

  const headerTag = `h${level}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    State(e.target.value)
    setText(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <input
          type="text"
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus
          style={{
            fontSize: 'inherit',
            fontWeight: 'inherit',
            border: 'none',
            outline: 'none',
            width: '100%',
            backgroundColor: 'transparent',
          }}
          className={className}
          {...props}
        />
      ) : (
        React.createElement(
          headerTag,
          {
            className: cn(headerClasses[level - 1], className),
            onClick: () => editable && setIsEditing(true),
            ...props
          },
          text
        )
      )}
    </div>
  );
};

export default EditHeader;
