import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Flexible Select component — works with both the `options` prop API
 * and native `<option>` children for maximum compatibility.
 */
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options?: { value: string; label: string }[];
  placeholder?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export function Select({
  options,
  placeholder = 'Select...',
  label,
  value,
  onChange,
  className,
  children,
  ...props
}: SelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      <select
        value={value}
        onChange={handleChange}
        className={cn(
          'flex h-10 w-full items-center rounded-lg border border-gray-300 bg-white px-3 py-2',
          'text-sm text-gray-900',
          'focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {/* Support children (native <option> elements) */}
        {children}
        {/* Support options prop */}
        {!children &&
          options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
      </select>
    </div>
  );
}
