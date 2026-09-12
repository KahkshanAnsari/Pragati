import React from 'react';
import { cn } from '../../lib/utils';
import { AnimatedCounter } from './AnimatedCounter';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface KPICardProps {
  label?: string;
  title?: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  iconBg?: string;
  accentColor?: 'navy' | 'blue' | 'cyan' | 'amber' | 'error' | 'success' | 'teal';
  description?: string;
  className?: string;
  animate?: boolean;
  onClick?: () => void;
}

const ACCENT_BORDER: Record<string, string> = {
  navy:    'border-l-navy-900',
  blue:    'border-l-blue-600',
  cyan:    'border-l-cyan-500',
  teal:    'border-l-cyan-500',
  success: 'border-l-blue-600',
  amber:   'border-l-amber-500',
  warning: 'border-l-amber-500',
  error:   'border-l-red-500',
};

const ICON_BG_DEFAULTS: Record<string, string> = {
  navy:    'bg-slate-100 text-navy-900',
  blue:    'bg-blue-50 text-blue-600',
  cyan:    'bg-cyan-50 text-cyan-600',
  teal:    'bg-cyan-50 text-cyan-600',
  success: 'bg-blue-50 text-blue-600',
  amber:   'bg-amber-50 text-amber-600',
  warning: 'bg-amber-50 text-amber-600',
  error:   'bg-red-50 text-red-600',
};

export function KPICard({
  label,
  title,
  value,
  change,
  trend = 'neutral',
  icon,
  iconBg,
  accentColor = 'navy',
  description,
  className,
  animate = true,
  onClick,
}: KPICardProps) {
  const displayLabel = label ?? title ?? '';
  const numericValue = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.]/g, ''));
  const isNumeric = !isNaN(numericValue) && animate;
  const prefix = typeof value === 'string' ? value.replace(/[\d,.]+$/, '').trim() : '';
  const suffix = typeof value === 'string' ? value.replace(/^[^0-9]*[\d,.]+/, '').trim() : '';
  const resolvedIconBg = iconBg ?? ICON_BG_DEFAULTS[accentColor] ?? ICON_BG_DEFAULTS.navy;

  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-card border border-slate-200',
        'border-l-4', ACCENT_BORDER[accentColor] ?? ACCENT_BORDER.navy,
        'p-5 flex flex-col gap-3',
        'transition-all duration-200',
        onClick && 'cursor-pointer hover:shadow-card-hover hover:-translate-y-0.5 active:scale-[0.99]',
        'animate-slide-up',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{displayLabel}</p>
        {icon && (
          <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border border-slate-100', resolvedIconBg)}>
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-extrabold tracking-tight text-slate-900 tabular-nums leading-none">
          {isNumeric ? (
            <AnimatedCounter
              target={numericValue}
              prefix={prefix}
              suffix={suffix}
              duration={1000}
              decimals={String(value).includes('.') ? 1 : 0}
            />
          ) : (
            value
          )}
        </span>
        {change && (
          <span
            className={cn('flex items-center text-xs font-semibold', {
              'text-blue-600':  trend === 'up',
              'text-red-500':   trend === 'down',
              'text-slate-400': trend === 'neutral',
            })}
          >
            {trend === 'up'      && <TrendingUp   className="w-3.5 h-3.5 mr-0.5" />}
            {trend === 'down'    && <TrendingDown  className="w-3.5 h-3.5 mr-0.5" />}
            {trend === 'neutral' && <Minus         className="w-3.5 h-3.5 mr-0.5" />}
            {change}
          </span>
        )}
      </div>

      {description && (
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      )}
    </div>
  );
}
