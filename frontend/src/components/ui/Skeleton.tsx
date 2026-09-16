import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-slate-200/80', className)}
      {...props}
    />
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('p-5 bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-3.5 animate-pulse', className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-5 w-3/4" />
      <div className="space-y-2 pt-1">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-5/6" />
      </div>
      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-7 w-24 rounded-md" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3, className }: { count?: number; className?: string }) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonRow({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-slate-100 animate-pulse">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-3 px-4">
          <Skeleton className={cn('h-4', i === 0 ? 'w-32' : 'w-20')} />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonTable({ rows = 5, columns = 5, className }: { rows?: number; columns?: number; className?: string }) {
  return (
    <div className={cn('w-full bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden animate-pulse', className)}>
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50/75 border-b border-slate-100">
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="py-3 px-4 text-left">
                <Skeleton className="h-3.5 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonRow key={i} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SkeletonKPIGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonPage({ children }: { children?: React.ReactNode }) {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto animate-pulse">
      <div className="space-y-2">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <SkeletonKPIGrid count={4} />
      {children || <SkeletonTable rows={4} columns={5} />}
    </div>
  );
}

/**
 * Realistic Skeleton representation of a Government / Startup Project Card.
 * Maintains the exact layout: badges, title, department, 4-metric grid, progress bar, footer.
 */
export function SkeletonProjectCard({ className }: { className?: string }) {
  return (
    <div className={cn('bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-4 animate-pulse', className)}>
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-32 rounded" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-28 rounded-full" />
          </div>
          <Skeleton className="h-6 w-3/4 rounded" />
          <Skeleton className="h-3.5 w-full rounded" />
        </div>
        <Skeleton className="h-8 w-28 rounded-lg shrink-0" />
      </div>

      <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
        <Skeleton className="h-4 w-44 rounded" />
        <Skeleton className="h-4 w-36 rounded" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/80">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="h-5 w-24 rounded" />
            <Skeleton className="h-2.5 w-16 rounded" />
          </div>
        ))}
      </div>

      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-28 rounded" />
          <Skeleton className="h-3 w-10 rounded" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-slate-100">
        <Skeleton className="h-3.5 w-48 rounded" />
        <Skeleton className="h-8 w-32 rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonProjectList({ count = 3, className }: { count?: number; className?: string }) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonProjectCard key={i} />
      ))}
    </div>
  );
}

/**
 * Realistic Skeleton representation of a Project Detail Page (Government & Startup).
 */
export function SkeletonProjectDetail() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-44 rounded-lg" />
        <Skeleton className="h-8 w-32 rounded-lg" />
      </div>

      {/* Hero Dossier Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-5 w-32 rounded" />
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-36 rounded-full" />
        </div>
        <Skeleton className="h-8 w-2/3 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-4/5 rounded" />

        {/* 4 Summary Metric Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-20 rounded" />
                <Skeleton className="h-3 w-8 rounded" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
              <Skeleton className="h-3 w-28 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-28 rounded-lg" />
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <Skeleton className="h-6 w-48 rounded" />
        <div className="space-y-3 pt-2">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-5/6 rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />
        </div>
      </div>
    </div>
  );
}

/**
 * Realistic Skeleton representation of a Startup Profile.
 */
export function SkeletonProfile() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Skeleton className="w-16 h-16 rounded-2xl shrink-0" />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-48 rounded" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-64 rounded" />
          </div>
        </div>
        <Skeleton className="h-10 w-36 rounded-lg shrink-0" />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SkeletonCard className="h-64" />
          <SkeletonCard className="h-48" />
        </div>
        <div className="space-y-6">
          <SkeletonCard className="h-56" />
          <SkeletonCard className="h-56" />
        </div>
      </div>
    </div>
  );
}

/**
 * Realistic Skeleton representation of AI Analysis synthesis card.
 */
export function SkeletonAISynthesis() {
  return (
    <div className="p-6 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-4 animate-pulse">
      <div className="flex items-center gap-2">
        <Skeleton className="w-4 h-4 rounded-full" />
        <Skeleton className="h-4 w-48 rounded" />
      </div>
      <Skeleton className="h-5 w-3/4 rounded" />
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-full rounded" />
        <Skeleton className="h-3.5 w-5/6 rounded" />
        <Skeleton className="h-3.5 w-2/3 rounded" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="p-3 bg-white rounded-lg border border-slate-200/60 space-y-2">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-3 w-full rounded" />
          <Skeleton className="h-3 w-4/5 rounded" />
        </div>
        <div className="p-3 bg-white rounded-lg border border-slate-200/60 space-y-2">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-3 w-full rounded" />
          <Skeleton className="h-3 w-4/5 rounded" />
        </div>
      </div>
    </div>
  );
}
