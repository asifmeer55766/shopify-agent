import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  id,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label ? (
        <label htmlFor={id} className="block text-xs font-medium text-slate-300 mb-1.5">
          {label}
        </label>
      ) : null}
      <input
        id={id}
        className={`w-full rounded-lg bg-slate-900 border ${
          error ? 'border-red-500' : 'border-slate-800'
        } px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors ${className}`}
        {...props}
      />
      {error ? <p className="mt-1 text-xs text-red-400">{error}</p> : null}
    </div>
  );
};
