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
    <div className={cn('p-5 bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-3.5', className)}>
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
    <tr className="border-b border-slate-100">
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
    <div className={cn('w-full bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden', className)}>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="space-y-2">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <SkeletonKPIGrid count={4} />
      {children || <SkeletonTable rows={4} columns={5} />}
    </div>
  );
}
