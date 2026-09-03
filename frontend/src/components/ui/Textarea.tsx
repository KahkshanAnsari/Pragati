import React from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, label, error, required, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-error-500">*</span>}</label>}
      <textarea
        ref={ref}
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-500 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-error-500 focus:ring-error-500',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-error-500">{error}</p>}
    </div>
  );
});
Textarea.displayName = 'Textarea';
