import React from 'react';
import { cn } from '../../lib/utils';

interface SpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Spinner({ className, size = 'md' }: SpinnerProps) {
  const sizes = {
    sm: 'h-1.5 w-5',
    md: 'h-2 w-8',
    lg: 'h-2.5 w-12',
  };
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-flex shrink-0 items-center justify-center animate-pulse rounded-full bg-current opacity-80',
        sizes[size],
        className
      )}
    />
  );
}

