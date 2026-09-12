import React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '../../lib/utils';

export interface ProgressBarProps {
  value?: number;
  progress?: number;
  color?: 'navy' | 'success' | 'warning' | 'error' | 'teal' | 'blue' | 'auto';
  showLabel?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  animated?: boolean;
  gradient?: boolean;
  className?: string;
  labelClassName?: string;
}

export function ProgressBar({
  value,
  progress,
  color = 'navy',
  showLabel,
  size = 'md',
  animated = true,
  gradient = false,
  className,
  labelClassName,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value ?? progress ?? 0));

  // Auto color based on percentage
  const resolvedColor = color === 'auto'
    ? pct >= 80 ? 'success' : pct >= 50 ? 'warning' : 'error'
    : color;

  const solidColors: Record<string, string> = {
    navy:    'bg-navy-700',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error:   'bg-error-500',
    teal:    'bg-teal-500',
    blue:    'bg-blue-500',
  };

  const gradientColors: Record<string, string> = {
    navy:    'bg-gradient-to-r from-navy-700 to-navy-500',
    success: 'bg-gradient-to-r from-success-600 to-success-400',
    warning: 'bg-gradient-to-r from-warning-600 to-warning-400',
    error:   'bg-gradient-to-r from-error-600 to-error-400',
    teal:    'bg-gradient-to-r from-teal-700 to-teal-400',
    blue:    'bg-gradient-to-r from-blue-700 to-blue-400',
  };

  const sizes: Record<string, string> = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const barColor = gradient
    ? (gradientColors[resolvedColor] ?? gradientColors.navy)
    : (solidColors[resolvedColor] ?? solidColors.navy);

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className={cn('flex justify-between items-center mb-1.5', labelClassName)}>
          <span className="text-xs text-slate-500" />
          <span className="text-xs font-semibold text-slate-700 tabular-nums">{Math.round(pct)}%</span>
        </div>
      )}
      <ProgressPrimitive.Root
        className={cn('relative w-full overflow-hidden rounded-full bg-slate-100', sizes[size])}
        value={pct}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            'h-full rounded-full',
            animated ? 'transition-all duration-700 ease-out' : '',
            barColor
          )}
          style={{ width: `${pct}%` }}
        />
      </ProgressPrimitive.Root>
    </div>
  );
}
