import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  elevated = false,
  className = '',
  ...props
}) => {
  const bgStyle = elevated
    ? 'bg-slate-900/90 border border-slate-700/80 shadow-lg shadow-black/40'
    : 'bg-slate-900/50 border border-slate-800/80 shadow-sm';

  return (
    <div className={`rounded-xl p-5 backdrop-blur-md ${bgStyle} ${className}`} {...props}>
      {children}
    </div>
  );
};
