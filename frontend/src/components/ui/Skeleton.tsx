import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'kpi' | 'row' | 'circle' | 'block';
  lines?: number;
  count?: number;
}

export function SkeletonItem({ className }: { className?: string }) {
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
            className={cn('h-3.5', i === lines - 1 ? 'w-3/4' : 'w-full')}
          />
        ))}
      </div>
    );
  }

  if (variant === 'kpi') {
    return (
      <div className={cn('bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-card', className)}>
        <div className="flex justify-between items-center">
          <SkeletonItem className="h-3.5 w-24" />
          <SkeletonItem className="h-8 w-8 rounded-lg" />
        </div>
        <SkeletonItem className="h-8 w-24" />
        <SkeletonItem className="h-3 w-32" />
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn('bg-white border border-slate-200 rounded-xl p-5 space-y-3.5 shadow-card', className)}>
        <div className="flex justify-between items-start">
          <div className="space-y-1.5 flex-1">
            <SkeletonItem className="h-3 w-20" />
            <SkeletonItem className="h-4.5 w-4/5" />
          </div>
          <SkeletonItem className="h-5 w-16 rounded-full" />
        </div>
        <SkeletonItem className="h-3 w-full" />
        <SkeletonItem className="h-3 w-5/6" />
        <div className="flex gap-2 pt-2 border-t border-slate-100">
          <SkeletonItem className="h-8 flex-1 rounded-lg" />
          <SkeletonItem className="h-8 flex-1 rounded-lg" />
        </div>
      </div>
    );
  }

  if (variant === 'row') {
    return (
      <div className={cn('flex items-center gap-3 py-3 border-b border-slate-100', className)}>
        <SkeletonItem className="h-9 w-9 rounded-lg shrink-0" />
        <div className="flex-1 space-y-1.5">
          <SkeletonItem className="h-4 w-2/3" />
          <SkeletonItem className="h-3 w-1/3" />
        </div>
        <SkeletonItem className="h-6 w-20 rounded-full shrink-0" />
      </div>
    );
  }

  if (variant === 'circle') {
    return <SkeletonItem className={cn('rounded-full', className)} />;
  }

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

export function KPISkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-${count} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} variant="kpi" />
      ))}
    </div>
  );
}

export function CardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} variant="card" />
      ))}
    </div>
  );
}

export function ProblemCardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-card">
          <div className="flex justify-between items-start">
            <div className="space-y-1.5 flex-1">
              <div className="flex gap-2">
                <SkeletonItem className="h-4 w-24 rounded" />
                <SkeletonItem className="h-4 w-20 rounded" />
              </div>
              <SkeletonItem className="h-5 w-3/4" />
            </div>
            <SkeletonItem className="h-6 w-20 rounded-full" />
          </div>
          <SkeletonItem className="h-3 w-full" />
          <SkeletonItem className="h-3 w-4/5" />
          <div className="flex justify-between items-center pt-2">
            <SkeletonItem className="h-4 w-32" />
            <SkeletonItem className="h-8 w-28 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PilotWorkspaceSkeleton() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-card">
        <SkeletonItem className="h-5 w-32" />
        <SkeletonItem className="h-7 w-2/3" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonItem key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-card">
            <SkeletonItem className="h-5 w-40" />
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonItem key={i} className="h-12 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 shadow-card">
            <SkeletonItem className="h-5 w-36" />
            <SkeletonItem className="h-24 rounded-lg" />
            <SkeletonItem className="h-10 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AIMatchingSkeleton() {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-card">
        <div className="flex justify-between items-center">
          <SkeletonItem className="h-5 w-44" />
          <SkeletonItem className="h-7 w-24 rounded-lg" />
        </div>
        <SkeletonItem className="h-4 w-3/4" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-card">
          <div className="flex justify-between items-start">
            <div className="flex gap-3 items-center">
              <SkeletonItem className="h-14 w-14 rounded-xl" />
              <div className="space-y-1.5">
                <SkeletonItem className="h-5 w-48" />
                <SkeletonItem className="h-3.5 w-32" />
              </div>
            </div>
            <SkeletonItem className="h-8 w-28 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
            {Array.from({ length: 6 }).map((_, j) => (
              <SkeletonItem key={j} className="h-14 rounded-lg" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardAnalyticsSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <SkeletonItem className="h-8 w-64" />
          <SkeletonItem className="h-4 w-48" />
        </div>
        <SkeletonItem className="h-9 w-32 rounded-lg" />
      </div>
      <KPISkeletonGrid count={4} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-card">
          <SkeletonItem className="h-5 w-40" />
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonItem key={i} className="h-12 rounded-lg" />
          ))}
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-card">
          <SkeletonItem className="h-5 w-40" />
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonItem key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
