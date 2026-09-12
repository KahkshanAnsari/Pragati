import React from 'react';

export interface PageHeaderProps {
  title: string;
  /** Alias: also accepts 'description' for backward compat */
  subtitle?: string;
  description?: string;
  action?: React.ReactNode;
  backLink?: string;
}

export function PageHeader({ title, subtitle, description, action, backLink }: PageHeaderProps) {
  const sub = subtitle ?? description;
  return (
    <div className="pb-6 mb-6 border-b border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          {backLink && (
            <a href={backLink} className="text-sm text-navy-600 hover:text-navy-900 mb-2 inline-flex items-center gap-1">
              ← Back
            </a>
          )}
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {sub && <p className="mt-1 text-sm text-gray-500">{sub}</p>}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
}
