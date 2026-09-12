import React from 'react';
import { cn } from '../../lib/utils';

export type BadgeVariant =
  | 'verified' | 'pending' | 'rejected' | 'suspended' | 'draft'
  | 'active' | 'completed' | 'pilot_active' | 'matched' | 'published'
  | 'high' | 'medium' | 'low'
  | 'success' | 'warning' | 'danger' | 'secondary' | 'outline' | 'info'
  | 'blue' | 'gray' | 'green' | 'red' | 'amber' | 'emerald' | 'teal' | 'indigo'
  | 'navy';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
  pulse?: boolean;
}

const VARIANTS: Record<BadgeVariant, string> = {
  verified:    'bg-success-50 text-success-700 border-success-200',
  success:     'bg-success-50 text-success-700 border-success-200',
  completed:   'bg-success-50 text-success-700 border-success-200',
  high:        'bg-success-50 text-success-700 border-success-200',
  green:       'bg-success-50 text-success-700 border-success-200',
  emerald:     'bg-teal-50 text-teal-700 border-teal-200',
  teal:        'bg-teal-50 text-teal-700 border-teal-200',
  pending:     'bg-amber-50 text-amber-700 border-amber-200',
  warning:     'bg-warning-50 text-warning-700 border-warning-200',
  medium:      'bg-amber-50 text-amber-700 border-amber-200',
  amber:       'bg-amber-50 text-amber-700 border-amber-200',
  matched:     'bg-amber-50 text-amber-700 border-amber-200',
  rejected:    'bg-error-50 text-error-700 border-error-200',
  suspended:   'bg-error-50 text-error-700 border-error-200',
  danger:      'bg-error-50 text-error-700 border-error-200',
  low:         'bg-error-50 text-error-700 border-error-200',
  red:         'bg-error-50 text-error-700 border-error-200',
  active:      'bg-blue-50 text-blue-700 border-blue-200',
  pilot_active:'bg-teal-50 text-teal-700 border-teal-200',
  published:   'bg-blue-50 text-blue-700 border-blue-200',
  info:        'bg-blue-50 text-blue-700 border-blue-200',
  blue:        'bg-blue-50 text-blue-700 border-blue-200',
  indigo:      'bg-indigo-50 text-indigo-700 border-indigo-200',
  navy:        'bg-navy-900 text-white border-navy-900',
  draft:       'bg-slate-100 text-slate-600 border-slate-200',
  secondary:   'bg-slate-100 text-slate-600 border-slate-200',
  gray:        'bg-slate-100 text-slate-600 border-slate-200',
  outline:     'bg-transparent text-slate-700 border-slate-300',
};

const DOT_COLORS: Record<string, string> = {
  success:     'bg-success-500',
  verified:    'bg-success-500',
  completed:   'bg-success-500',
  active:      'bg-blue-500',
  pilot_active:'bg-teal-500',
  published:   'bg-blue-500',
  pending:     'bg-amber-500',
  warning:     'bg-warning-500',
  rejected:    'bg-error-500',
  draft:       'bg-slate-400',
};

export function Badge({ className, variant = 'draft', dot = false, pulse = false, children, ...props }: BadgeProps) {
  const dotColor = DOT_COLORS[variant] ?? 'bg-slate-400';
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
        VARIANTS[variant] ?? VARIANTS.draft,
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColor, pulse && 'animate-pulse')} />
      )}
      {children}
    </span>
  );
}
