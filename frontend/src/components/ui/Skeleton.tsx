import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'kpi' | 'row' | 'circle' | 'block';
  lines?: number;
  count?: number;
}

function SkeletonItem({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-md bg-slate-200 skeleton-shimmer',
        className
      )}
    />
  );
}

export function Skeleton({ className, variant = 'block', lines = 3, count = 1 }: SkeletonProps) {
  if (variant === 'text') {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonItem
            key={i}
            className={cn('h-4', i === lines - 1 ? 'w-3/4' : 'w-full')}
          />
        ))}
      </div>
    );
  }

  if (variant === 'kpi') {
    return (
      <div className={cn('bg-white border border-slate-200 rounded-xl p-6 space-y-3', className)}>
        <div className="flex justify-between items-center">
          <SkeletonItem className="h-4 w-24" />
          <SkeletonItem className="h-9 w-9 rounded-lg" />
        </div>
        <SkeletonItem className="h-9 w-20" />
        <SkeletonItem className="h-3 w-32" />
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn('bg-white border border-slate-200 rounded-xl p-6 space-y-4', className)}>
        <div className="flex items-center gap-3">
          <SkeletonItem className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <SkeletonItem className="h-4 w-3/4" />
            <SkeletonItem className="h-3 w-1/2" />
          </div>
        </div>
        <SkeletonItem className="h-3 w-full" />
        <SkeletonItem className="h-3 w-5/6" />
        <SkeletonItem className="h-3 w-4/6" />
        <div className="flex gap-2 pt-2">
          <SkeletonItem className="h-6 w-16 rounded-full" />
          <SkeletonItem className="h-6 w-20 rounded-full" />
        </div>
      </div>
    );
  }

  if (variant === 'row') {
    return (
      <div className={cn('flex items-center gap-3 py-3', className)}>
        <SkeletonItem className="h-8 w-8 rounded-full shrink-0" />
        <div className="flex-1 space-y-1.5">
          <SkeletonItem className="h-3.5 w-2/3" />
          <SkeletonItem className="h-3 w-1/3" />
        </div>
        <SkeletonItem className="h-6 w-16 rounded-full shrink-0" />
      </div>
    );
  }

  if (variant === 'circle') {
    return <SkeletonItem className={cn('rounded-full', className)} />;
  }

  // Default block
  if (count > 1) {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonItem key={i} className={cn('h-4 w-full', className)} />
        ))}
      </div>
    );
  }

  return <SkeletonItem className={cn('h-4 w-full', className)} />;
}

// Grid of KPI skeletons
export function KPISkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-${count} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} variant="kpi" />
      ))}
    </div>
  );
}

// Grid of card skeletons
export function CardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} variant="card" />
      ))}
    </div>
  );
}
