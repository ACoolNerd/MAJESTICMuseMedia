import type { EpisodeStage, EpisodeStatus, GuestStatus, ReleaseGateStatus } from '../types';

export function cn(...classes: Array<string | undefined | null | false>): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: Date | undefined): string {
  if (!date) return '—';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function formatDateShort(date: Date | undefined): string {
  if (!date) return '—';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export const STAGE_LABELS: Record<EpisodeStage, string> = {
  concept: 'Concept',
  guest_development: 'Guest Development',
  pre_production: 'Pre-Production',
  production_capture: 'Production Capture',
  create_and_ingest: 'Create & Ingest',
  cut: 'Cut',
  package: 'Package',
  release: 'Release',
  amplify: 'Amplify',
  learn: 'Learn',
};

export const STATUS_LABELS: Record<EpisodeStatus, string> = {
  proposed: 'Proposed',
  confirmed: 'Confirmed',
  in_progress: 'In Progress',
  completed: 'Completed',
  archived: 'Archived',
};

export const GUEST_STATUS_LABELS: Record<GuestStatus, string> = {
  proposed: 'Proposed',
  outreach: 'Outreach',
  confirmed: 'Confirmed',
  recorded: 'Recorded',
  released: 'Released',
  archived: 'Archived',
};

export const RELEASE_GATE_LABELS: Record<ReleaseGateStatus, string> = {
  pending: 'Pending',
  in_review: 'In Review',
  passed: 'Passed',
  blocked: 'Blocked',
  waived: 'Waived',
};

export function getDaysUntil(date: Date): number {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
