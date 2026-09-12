import React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '../../lib/utils';

export interface ProgressBarProps {
  /** Primary prop */
  value?: number;
  /** Alias for value — some pages use progress= */
  progress?: number;
  color?: 'navy' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProgressBar({
  value,
  progress,
  color = 'navy',
  showLabel,
  size = 'md',
  className,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value ?? progress ?? 0));

  const colors = {
    navy:    'bg-navy-600',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error:   'bg-error-500',
  };
  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full', className)}>
      <ProgressPrimitive.Root
        className={cn('relative w-full overflow-hidden rounded-full bg-gray-200', sizes[size])}
        value={pct}
      >
        <ProgressPrimitive.Indicator
          className={cn('h-full transition-all duration-500 ease-out rounded-full', colors[color])}
          style={{ width: `${pct}%` }}
        />
      </ProgressPrimitive.Root>
      {showLabel && (
        <div className="mt-1 text-xs text-gray-500 text-right">{Math.round(pct)}%</div>
      )}
    </div>
  );
}
