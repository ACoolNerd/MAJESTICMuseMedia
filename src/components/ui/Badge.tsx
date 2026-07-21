import type { CSSProperties, ReactNode } from 'react';
import type { EpisodeStatus, ReleaseGateStatus } from '../../types';
import { cn } from '../../lib/utils';

type BadgeVariant = 'gold' | 'plum' | 'rose' | 'ivory' | 'success' | 'warning' | 'danger' | 'neutral';

const variantStyles: Record<BadgeVariant, CSSProperties> = {
  gold: { backgroundColor: '#C9A22722', color: '#C9A227', border: '1px solid #C9A22744' },
  plum: { backgroundColor: '#8B2C6F22', color: '#D8A7B1', border: '1px solid #8B2C6F44' },
  rose: { backgroundColor: '#D8A7B122', color: '#D8A7B1', border: '1px solid #D8A7B144' },
  ivory: { backgroundColor: '#F8F4EC22', color: '#F8F4EC', border: '1px solid #F8F4EC33' },
  success: { backgroundColor: '#16A34A22', color: '#4ADE80', border: '1px solid #16A34A44' },
  warning: { backgroundColor: '#D9770622', color: '#FB923C', border: '1px solid #D9770644' },
  danger: { backgroundColor: '#DC262622', color: '#F87171', border: '1px solid #DC262644' },
  neutral: { backgroundColor: '#FFFFFF11', color: '#FFFFFF88', border: '1px solid #FFFFFF22' },
};

export const statusVariant: Record<EpisodeStatus, BadgeVariant> = {
  proposed: 'neutral',
  confirmed: 'gold',
  in_progress: 'plum',
  completed: 'success',
  archived: 'neutral',
};

export const gateStatusVariant: Record<ReleaseGateStatus, BadgeVariant> = {
  pending: 'neutral',
  in_review: 'warning',
  passed: 'success',
  blocked: 'danger',
  waived: 'ivory',
};

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export default function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', className)} style={variantStyles[variant]}>
      {children}
    </span>
  );
}
