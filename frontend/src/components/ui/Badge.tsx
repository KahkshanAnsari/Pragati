import React from 'react';
import { cn } from '../../lib/utils';

export type BadgeVariant =
  | 'verified' | 'pending' | 'rejected' | 'suspended' | 'draft'
  | 'active' | 'completed' | 'high' | 'medium' | 'low'
  | 'success' | 'warning' | 'danger' | 'secondary' | 'outline' | 'info'
  | 'blue' | 'gray' | 'green' | 'red' | 'amber' | 'emerald';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const VARIANTS: Record<BadgeVariant, string> = {
  verified:   'bg-success-50 text-success-700 border-success-500',
  success:    'bg-success-50 text-success-700 border-success-500',
  completed:  'bg-success-50 text-success-700 border-success-500',
  high:       'bg-success-50 text-success-700 border-success-500',
  green:      'bg-success-50 text-success-700 border-success-500',
  emerald:    'bg-success-50 text-success-700 border-success-500',
  pending:    'bg-warning-50 text-warning-700 border-warning-500',
  warning:    'bg-warning-50 text-warning-700 border-warning-500',
  medium:     'bg-warning-50 text-warning-700 border-warning-500',
  amber:      'bg-warning-50 text-warning-700 border-warning-500',
  rejected:   'bg-error-50 text-error-700 border-error-500',
  suspended:  'bg-error-50 text-error-700 border-error-500',
  danger:     'bg-error-50 text-error-700 border-error-500',
  low:        'bg-error-50 text-error-700 border-error-500',
  red:        'bg-error-50 text-error-700 border-error-500',
  active:     'bg-blue-50 text-blue-600 border-blue-400',
  info:       'bg-blue-50 text-blue-600 border-blue-400',
  blue:       'bg-blue-50 text-blue-600 border-blue-400',
  draft:      'bg-gray-100 text-gray-700 border-gray-300',
  secondary:  'bg-gray-100 text-gray-700 border-gray-300',
  gray:       'bg-gray-100 text-gray-700 border-gray-300',
  outline:    'bg-transparent text-gray-700 border-gray-400',
};

export function Badge({ className, variant = 'draft', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        VARIANTS[variant] ?? VARIANTS.draft,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
