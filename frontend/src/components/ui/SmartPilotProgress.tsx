import React from 'react';
import { ProgressBar } from './ProgressBar';
import { cn } from '../../lib/utils';
import { Pilot } from '../../types';
import {
  CheckCircle2,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  Clock,
} from 'lucide-react';

export type PilotProgressStatus = 'completed' | 'ahead' | 'on_track' | 'needs_attention' | 'at_risk';

export interface PilotProgressInfo {
  actual: number;
  expected: number;
  delta: number;
  status: PilotProgressStatus;
  label: string;
  badgeClass: string;
  dotColor: string;
  barColor: 'navy' | 'success' | 'warning' | 'error';
  icon: React.ComponentType<{ className?: string }>;
}

/**
 * Calculates project progress health by comparing Actual Progress %
 * against Expected Progress % based on the pilot's timeline (start_date, end_date / duration_days, and current date).
 */
export function getPilotProgressInfo(pilot: Partial<Pilot> | any): PilotProgressInfo {
  const actual = Math.round(pilot.progress_percent || 0);
  const isCompleted = pilot.status === 'completed' || actual >= 100;

  let expected = 0;

  if (isCompleted) {
    expected = 100;
  } else if (pilot.start_date) {
    const start = new Date(pilot.start_date).getTime();
    let end: number;

    if (pilot.end_date) {
      end = new Date(pilot.end_date).getTime();
    } else {
      const durationDays = Number(pilot.duration_days) || 90;
      end = start + durationDays * 24 * 60 * 60 * 1000;
    }

    const totalDuration = end - start;
    const elapsed = Date.now() - start;

    if (elapsed <= 0) {
      expected = 0; // Not yet started
    } else if (totalDuration <= 0) {
      expected = 100;
    } else {
      // Calculate expected % along the timeline
      expected = Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));
    }
  } else {
    // If no start date specified yet, baseline against draft or early active state
    expected = pilot.status === 'draft' ? 0 : Math.min(actual, 25);
  }

  const delta = actual - expected;

  // 1. Completed
  if (isCompleted) {
    return {
      actual: 100,
      expected: 100,
      delta: 0,
      status: 'completed',
      label: 'Completed',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dotColor: 'text-emerald-600',
      barColor: 'success',
      icon: CheckCircle2,
    };
  }

  // 2. Ahead of schedule (actual clearly exceeds expected by >= 8%)
  if (delta >= 8) {
    return {
      actual,
      expected,
      delta,
      status: 'ahead',
      label: 'Ahead of Schedule',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dotColor: 'text-emerald-600',
      barColor: 'success',
      icon: TrendingUp,
    };
  }

  // 3. On Track (actual approximately equal to expected: delta between -5% and +7%)
  if (delta >= -5) {
    return {
      actual,
      expected,
      delta,
      status: 'on_track',
      label: 'On Track',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dotColor: 'text-emerald-600',
      barColor: 'success',
      icon: CheckCircle,
    };
  }

  // 4. Needs Attention (actual slightly below expected: delta between -15% and -6%)
  if (delta >= -15) {
    return {
      actual,
      expected,
      delta,
      status: 'needs_attention',
      label: 'Needs Attention',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
      dotColor: 'text-amber-500',
      barColor: 'warning',
      icon: AlertTriangle,
    };
  }

  // 5. At Risk (actual significantly below expected: delta < -15%)
  return {
    actual,
    expected,
    delta,
    status: 'at_risk',
    label: 'At Risk',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    dotColor: 'text-rose-600',
    barColor: 'error',
    icon: AlertCircle,
  };
}

interface SmartPilotProgressProps {
  pilot: Partial<Pilot> | any;
  showDetails?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SmartPilotProgress: React.FC<SmartPilotProgressProps> = ({
  pilot,
  showDetails = true,
  className,
  size = 'md',
}) => {
  const info = getPilotProgressInfo(pilot);
  const StatusIcon = info.icon;

  return (
    <div className={cn('space-y-1.5', className)}>
      {showDetails && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-medium text-slate-700">
            <span>
              Progress: <strong className="text-slate-900 font-bold">{info.actual}%</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              Expected: <strong className="text-slate-700 font-semibold">{info.expected}%</strong>
            </span>
          </div>

          <span
            className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border',
              info.badgeClass
            )}
          >
            <StatusIcon className="w-3 h-3 shrink-0" />
            {info.label}
          </span>
        </div>
      )}

      <ProgressBar value={info.actual} color={info.barColor} size={size} />
    </div>
  );
};

export default SmartPilotProgress;
