import React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '../../lib/utils';

export interface ProgressBarProps {
  value?: number;
  progress?: number;
  color?: 'navy' | 'blue' | 'cyan' | 'warning' | 'error' | 'success' | 'auto';
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
  color = 'blue',
  showLabel,
  size = 'md',
  animated = true,
  gradient: _gradient,
  className,
  labelClassName,
}: ProgressBarProps) {
  const rawPct = value ?? progress ?? 0;
  const pct = Math.min(100, Math.max(0, rawPct));
  const isFull = pct >= 100;

  // Auto color based on percentage
  const resolvedColor = color === 'auto'
    ? pct >= 70 ? 'blue' : pct >= 40 ? 'cyan' : 'warning'
    : color;

  const colorStyles: Record<string, string> = {
    navy:    'bg-navy-900',
    blue:    'bg-blue-600',
    cyan:    'bg-cyan-500',
    warning: 'bg-amber-500',
    error:   'bg-red-500',
    success: 'bg-blue-600',
  };

  const sizes: Record<string, string> = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-2.5',
  };

  const barColor = colorStyles[resolvedColor] ?? colorStyles.blue;

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className={cn('flex justify-between items-center mb-1.5', labelClassName)}>
          <span className="text-xs font-medium text-slate-500">Progress</span>
          <span className="text-xs font-bold text-slate-900 tabular-nums">{Math.round(pct)}%</span>
        </div>
      )}
      <div className={cn('relative w-full overflow-hidden rounded-full bg-slate-100', sizes[size])}>
        <div
          className={cn(
            'h-full',
            isFull ? 'w-full rounded-full' : 'rounded-l-full',
            animated ? 'transition-[width] duration-500 ease-out' : '',
            barColor
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
