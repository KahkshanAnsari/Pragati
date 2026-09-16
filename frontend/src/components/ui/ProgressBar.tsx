import React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '../../lib/utils';

export type ProgressTier = 'low' | 'mid' | 'high';

/**
 * Returns the tier classification for any percentage value:
 * - low: 0%–39%
 * - mid: 40%–69%
 * - high: 70%–100%
 */
export function getProgressTier(pct: number): ProgressTier {
  if (pct < 40) return 'low';
  if (pct < 70) return 'mid';
  return 'high';
}

/**
 * Standard PRAGATI 3-tier percentage progress color system:
 * - 0%–39%: LIGHT RED (soft, accessible rose/red)
 * - 40%–69%: LIGHT YELLOW (soft, accessible amber/yellow)
 * - 70%–100%: LIGHT GREEN (soft, accessible emerald/green)
 * Uses soft/light shades with readable contrast.
 */
export function getProgressColorClass(pct: number): string {
  if (pct < 40) return 'bg-rose-400';
  if (pct < 70) return 'bg-amber-400';
  return 'bg-emerald-500';
}

export function getProgressTextColor(pct: number): string {
  if (pct < 40) return 'text-rose-700';
  if (pct < 70) return 'text-amber-800';
  return 'text-emerald-800';
}

export function getProgressBadgeClass(pct: number): string {
  if (pct < 40) return 'bg-rose-50 text-rose-700 border-rose-200';
  if (pct < 70) return 'bg-amber-50 text-amber-800 border-amber-200';
  return 'bg-emerald-50 text-emerald-700 border-emerald-200';
}

export function getProgressAccessibleLabel(pct: number): string {
  if (pct < 40) return 'Initial Stage (0%–39%)';
  if (pct < 70) return 'In Progress (40%–69%)';
  return 'Advanced Stage (70%–100%)';
}

export interface ProgressBarProps {
  /** Primary prop: percentage value (0 to 100) */
  value?: number;
  /** Alias for value */
  progress?: number;
  /**
   * Color override if strictly required. Defaults to 'auto' which dynamically
   * determines the color from the actual percentage value:
   *  - 0%–39%: Light Red
   *  - 40%–69%: Light Yellow
   *  - 70%–100%: Light Green
   */
  color?: 'auto' | 'navy' | 'success' | 'warning' | 'error' | 'light-red' | 'light-yellow' | 'light-green';
  showLabel?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  ariaLabel?: string;
}

export function ProgressBar({
  value,
  progress,
  color = 'auto',
  showLabel,
  size = 'md',
  className,
  ariaLabel,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value ?? progress ?? 0));
  const roundedPct = Math.round(pct);
  const dynamicColor = getProgressColorClass(pct);
  const accessibleLabel = ariaLabel || `Progress: ${roundedPct}% — ${getProgressAccessibleLabel(pct)}`;

  let indicatorColor = dynamicColor;
  if (color && color !== 'auto') {
    const legacyColors: Record<string, string> = {
      'light-red': 'bg-rose-400',
      'light-yellow': 'bg-amber-400',
      'light-green': 'bg-emerald-500',
      navy: 'bg-navy-600',
      success: 'bg-emerald-500',
      warning: 'bg-amber-400',
      error: 'bg-rose-400',
    };
    indicatorColor = legacyColors[color] || dynamicColor;
  }

  const sizes = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full', className)}>
      <ProgressPrimitive.Root
        className={cn('relative w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200/50', sizes[size])}
        value={pct}
        aria-valuenow={roundedPct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={accessibleLabel}
        title={accessibleLabel}
      >
        <ProgressPrimitive.Indicator
          className={cn('h-full transition-all duration-500 ease-out rounded-full', indicatorColor)}
          style={{ width: `${pct}%` }}
        />
      </ProgressPrimitive.Root>
      {showLabel && (
        <div className="mt-1 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-500 font-medium">
            {getProgressAccessibleLabel(pct)}
          </span>
          <span className={cn('font-bold text-xs', getProgressTextColor(pct))}>
            {roundedPct}%
          </span>
        </div>
      )}
    </div>
  );
}

export default ProgressBar;
