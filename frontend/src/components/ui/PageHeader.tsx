import React from 'react';
import { cn } from '../../lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  backLink?: string;
  breadcrumb?: Array<{ label: string; href?: string }>;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, description, backLink, breadcrumb, actions, badge, className }: PageHeaderProps) {
  const displaySubtitle = subtitle ?? description;
  return (
    <div className={cn('flex items-start justify-between gap-4 animate-fade-in', className)}>
      <div className="min-w-0">
        {backLink && !breadcrumb && (
          <a
            href={backLink}
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-navy-900 mb-2 gap-1 transition-colors"
          >
            ← Back
          </a>
        )}
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="flex items-center gap-1.5 mb-2" aria-label="Breadcrumb">
            {breadcrumb.map((crumb, i) => (
              <React.Fragment key={crumb.label}>
                {i > 0 && <span className="text-slate-300 text-xs">/</span>}
                {crumb.href ? (
                  <a
                    href={crumb.href}
                    className="text-xs font-medium text-slate-500 hover:text-navy-900 transition-colors"
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-xs font-medium text-slate-500">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">{title}</h1>
          {badge}
        </div>
        {displaySubtitle && (
          <p className="mt-1 text-sm text-slate-500 leading-relaxed max-w-2xl">{displaySubtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap justify-end">
          {actions}
        </div>
      )}
    </div>
  );
}
