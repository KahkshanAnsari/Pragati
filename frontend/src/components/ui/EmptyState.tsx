import React from 'react';
import { cn } from '../../lib/utils';
import { Button } from './Button';
import { Inbox, SearchX, AlertCircle, FolderOpen, Rocket } from 'lucide-react';

type EmptyVariant = 'default' | 'search' | 'error' | 'folder' | 'pilot';

const ICONS: Record<EmptyVariant, React.ElementType> = {
  default: Inbox,
  search:  SearchX,
  error:   AlertCircle,
  folder:  FolderOpen,
  pilot:   Rocket,
};

const COLORS: Record<EmptyVariant, string> = {
  default: 'bg-slate-100 text-slate-400',
  search:  'bg-blue-50 text-blue-400',
  error:   'bg-error-50 text-error-400',
  folder:  'bg-amber-50 text-amber-400',
  pilot:   'bg-teal-50 text-teal-500',
};

interface EmptyStateProps {
  variant?: EmptyVariant;
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  compact?: boolean;
}

export function EmptyState({
  variant = 'default',
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  compact = false,
}: EmptyStateProps) {
  const Icon = icon || ICONS[variant];
  const colorClass = COLORS[variant];

  if (compact) {
    return (
      <div className={cn('flex items-center gap-3 py-6 px-4 text-center justify-center', className)}>
        <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0', colorClass)}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-slate-700">{title}</p>
          {description && <p className="text-xs text-slate-500">{description}</p>}
        </div>
        {action && (
          <Button size="sm" variant="outline" onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center py-16 px-8',
      'animate-fade-in',
      className
    )}>
      <div className={cn(
        'w-16 h-16 rounded-2xl flex items-center justify-center mb-4',
        colorClass
      )}>
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-slate-800 mb-1.5">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 max-w-xs leading-relaxed mb-6">{description}</p>
      )}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3">
          {action && (
            <Button onClick={action.onClick} size="sm">
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick} size="sm">
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
