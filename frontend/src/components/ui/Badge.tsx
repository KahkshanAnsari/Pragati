import React from 'react';
import { cn } from '../../lib/utils';

export type BadgeVariant =
  | 'verified' | 'pending' | 'rejected' | 'suspended' | 'draft'
  | 'active' | 'completed' | 'pilot_active' | 'matched' | 'published'
  | 'high' | 'medium' | 'low'
  | 'success' | 'warning' | 'danger' | 'secondary' | 'outline' | 'info'
  | 'blue' | 'gray' | 'green' | 'red' | 'amber' | 'emerald' | 'teal' | 'indigo' | 'cyan'
  | 'navy';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
  pulse?: boolean;
}

const VARIANTS: Record<BadgeVariant, string> = {
  verified:    'bg-blue-50 text-blue-700 border-blue-200',
  success:     'bg-blue-50 text-blue-700 border-blue-200',
  completed:   'bg-blue-50 text-blue-700 border-blue-200',
  high:        'bg-blue-50 text-blue-700 border-blue-200',
  green:       'bg-blue-50 text-blue-700 border-blue-200',
  emerald:     'bg-cyan-50 text-cyan-700 border-cyan-200',
  teal:        'bg-cyan-50 text-cyan-700 border-cyan-200',
  cyan:        'bg-cyan-50 text-cyan-700 border-cyan-200',
  pending:     'bg-amber-50 text-amber-700 border-amber-200',
  warning:     'bg-amber-50 text-amber-700 border-amber-200',
  medium:      'bg-amber-50 text-amber-700 border-amber-200',
  amber:       'bg-amber-50 text-amber-700 border-amber-200',
  matched:     'bg-blue-50 text-blue-700 border-blue-200',
  rejected:    'bg-red-50 text-red-700 border-red-200',
  suspended:   'bg-red-50 text-red-700 border-red-200',
  danger:      'bg-red-50 text-red-700 border-red-200',
  low:         'bg-red-50 text-red-700 border-red-200',
  red:         'bg-red-50 text-red-700 border-red-200',
  active:      'bg-cyan-50 text-cyan-700 border-cyan-200',
  pilot_active:'bg-cyan-50 text-cyan-700 border-cyan-200',
  published:   'bg-blue-50 text-blue-700 border-blue-200',
  info:        'bg-blue-50 text-blue-700 border-blue-200',
  blue:        'bg-blue-50 text-blue-700 border-blue-200',
  indigo:      'bg-blue-50 text-blue-700 border-blue-200',
  navy:        'bg-navy-900 text-white border-navy-900',
  draft:       'bg-slate-100 text-slate-600 border-slate-200',
  secondary:   'bg-slate-100 text-slate-600 border-slate-200',
  gray:        'bg-slate-100 text-slate-600 border-slate-200',
  outline:     'bg-transparent text-slate-700 border-slate-300',
};

const DOT_COLORS: Record<string, string> = {
  success:     'bg-blue-600',
  verified:    'bg-blue-600',
  completed:   'bg-blue-600',
  active:      'bg-cyan-500',
  pilot_active:'bg-cyan-500',
  published:   'bg-blue-600',
  pending:     'bg-amber-500',
  warning:     'bg-amber-500',
  rejected:    'bg-red-500',
  draft:       'bg-slate-400',
};

export function Badge({
  variant = 'secondary',
  dot = false,
  pulse = false,
  className,
  children,
  ...props
}: BadgeProps) {
  const variantClass = VARIANTS[variant] ?? VARIANTS.secondary;
  const dotColor = DOT_COLORS[variant] ?? 'bg-slate-400';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full',
        'text-xs font-semibold tracking-wide border',
        'transition-colors duration-150 select-none',
        variantClass,
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full shrink-0',
            dotColor,
            pulse && 'animate-pulse'
          )}
        />
      )}
      {children}
    </span>
  );
}
