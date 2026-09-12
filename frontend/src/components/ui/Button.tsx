import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'success' | 'warning' | 'accent' | 'navy-light';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const variants: Record<string, string> = {
      primary:     'bg-navy-900 text-white hover:bg-navy-800 focus:ring-navy-500 shadow-button hover:shadow-button-hover active:scale-[0.98]',
      secondary:   'bg-white text-navy-900 border border-navy-900 hover:bg-slate-50 focus:ring-navy-500 shadow-xs hover:shadow-sm active:scale-[0.98]',
      outline:     'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 focus:ring-slate-400 shadow-xs hover:shadow-sm active:scale-[0.98]',
      ghost:       'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-400 active:scale-[0.98]',
      danger:      'bg-error-500 text-white hover:bg-error-600 focus:ring-error-500 shadow-button hover:shadow-md active:scale-[0.98]',
      success:     'bg-success-500 text-white hover:bg-success-600 focus:ring-success-500 shadow-button hover:shadow-md active:scale-[0.98]',
      warning:     'bg-warning-500 text-white hover:bg-warning-600 focus:ring-warning-500 shadow-button hover:shadow-md active:scale-[0.98]',
      accent:      'bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500 shadow-button hover:shadow-button-hover active:scale-[0.98]',
      'navy-light':'bg-navy-900/10 text-navy-900 hover:bg-navy-900/15 focus:ring-navy-500 border border-navy-900/20 active:scale-[0.98]',
    };
    const sizes: Record<string, string> = {
      xs: 'px-2.5 py-1 text-xs gap-1',
      sm: 'px-3.5 py-1.5 text-sm gap-1.5',
      md: 'px-4.5 py-2 text-sm gap-2',
      lg: 'px-6 py-2.5 text-base gap-2',
      xl: 'px-8 py-3.5 text-base gap-2.5',
    };
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-semibold rounded-lg',
          'transition-all duration-150 ease-smooth',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          'select-none cursor-pointer',
          variants[variant] ?? variants.primary,
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin shrink-0" />
        ) : leftIcon ? (
          <span className="shrink-0">{leftIcon}</span>
        ) : null}
        {children}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = 'Button';
