import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: string;
  hover?: boolean;
  glass?: boolean;
  variant?: 'default' | 'bordered' | 'elevated' | 'flat' | 'navy' | 'teal' | 'amber';
}

const VARIANTS: Record<string, string> = {
  default:  'bg-white border border-slate-200 shadow-card',
  bordered: 'bg-white border-2 border-slate-200',
  elevated: 'bg-white border border-slate-100 shadow-modal',
  flat:     'bg-slate-50 border border-slate-200',
  navy:     'bg-navy-900 border border-navy-800 text-white',
  teal:     'bg-teal-600 border border-teal-500 text-white',
  amber:    'bg-amber-50 border border-amber-200',
};

export function Card({ className, padding = 'p-6', children, hover = false, glass = false, variant = 'default', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl',
        VARIANTS[variant] ?? VARIANTS.default,
        hover && 'card-hover cursor-pointer',
        glass && 'glass',
        padding,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-6 py-4 border-b border-slate-100 flex items-center justify-between', className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-base font-bold text-slate-900 tracking-tight', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-6 py-4 border-t border-slate-100 bg-slate-50/60 rounded-b-xl', className)} {...props}>
      {children}
    </div>
  );
}

// Section header within a card
export function CardSectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h4 className="text-sm font-bold text-slate-900">{title}</h4>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
