import React from 'react';
import { Card } from './Card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface KPICardProps {
  label?: string;
  /** Alias for label */
  title?: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  className?: string;
}

export function KPICard({ label, title, value, change, trend = 'neutral', icon, className }: KPICardProps) {
  const displayLabel = label ?? title ?? '';
  return (
    <Card className={cn('flex flex-col', className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">{displayLabel}</h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-navy-900">{value}</span>
        {change && (
          <span
            className={cn('flex items-center text-sm font-medium', {
              'text-success-500': trend === 'up',
              'text-error-500':   trend === 'down',
              'text-gray-500':    trend === 'neutral',
            })}
          >
            {trend === 'up'      && <TrendingUp   className="w-4 h-4 mr-1" />}
            {trend === 'down'    && <TrendingDown  className="w-4 h-4 mr-1" />}
            {trend === 'neutral' && <Minus         className="w-4 h-4 mr-1" />}
            {change}
          </span>
        )}
      </div>
    </Card>
  );
}
