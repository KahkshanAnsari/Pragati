import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const variants: Record<string, string> = {
      primary:  'bg-navy-900 text-white hover:bg-navy-800 focus:ring-navy-500',
      secondary:'bg-white text-navy-900 border border-navy-900 hover:bg-gray-50 focus:ring-navy-500',
      outline:  'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-400',
      ghost:    'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400',
      danger:   'bg-error-500 text-white hover:bg-error-600 focus:ring-error-500',
      success:  'bg-success-500 text-white hover:bg-success-600 focus:ring-success-500',
      warning:  'bg-warning-500 text-white hover:bg-warning-600 focus:ring-warning-500',
    };
    const sizes: Record<string, string> = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          variants[variant] ?? variants.primary,
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
