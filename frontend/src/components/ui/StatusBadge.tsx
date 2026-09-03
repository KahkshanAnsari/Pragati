import React from 'react';
import { Badge, type BadgeVariant } from './Badge';

export interface StatusBadgeProps {
  status: string;
  className?: string;
}

const STATUS_MAP: Record<string, BadgeVariant> = {
  verified:            'verified',
  government_verified: 'verified',
  scaled:              'verified',
  completed:           'completed',
  successful:          'success',
  high:                'high',
  active:              'active',
  pilot_completed:     'active',
  pending:             'pending',
  under_review:        'pending',
  matched:             'pending',
  medium:              'medium',
  on_track:            'info',
  achieved:            'success',
  submitted:           'info',
  shortlisted:         'warning',
  at_risk:             'warning',
  draft:               'draft',
  published:           'secondary',
  rejected:            'rejected',
  suspended:           'suspended',
  terminated:          'danger',
  missed:              'danger',
  unsuccessful:        'danger',
  low:                 'low',
  reported:            'warning',
  under_investigation: 'pending',
  resolved:            'success',
  needs_review:        'warning',
  inspector_verified:  'success',
  startup_claimed:     'warning',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const key = status.toLowerCase().replace(/\s+/g, '_');
  const variant: BadgeVariant = STATUS_MAP[key] ?? 'draft';
  return (
    <Badge variant={variant} className={className}>
      {status.replace(/_/g, ' ').toUpperCase()}
    </Badge>
  );
}
