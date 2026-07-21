import type { EpisodeStage, Role, Status } from '../../types';
import type { EpisodeRecord, GuestRecord, ReleaseGateRecord } from './types';

const stageOrder: EpisodeStage[] = [
  'Concept',
  'Guest Development',
  'Pre-Production',
  'Production Capture',
  'Create / Ingest',
  'Cut',
  'Package',
  'Release',
  'Amplify',
  'Learn',
];

export interface TransitionDecision {
  allowed: boolean;
  blockers: string[];
}

function allGatesPassed(gates: ReleaseGateRecord[]): boolean {
  return gates.every(gate => gate.status === 'Passed' || gate.status === 'Waived with Written Reason');
}

export function canConfirmStatus(current: Status, requested: Status, role: Role): TransitionDecision {
  if (requested !== 'Confirmed') return { allowed: true, blockers: [] };
  if (current === 'Confirmed') return { allowed: true, blockers: [] };
  if (!['ceo', 'coo'].includes(role)) {
    return { allowed: false, blockers: ['Only an executive role may convert an unconfirmed record to Confirmed.'] };
  }
  return { allowed: true, blockers: [] };
}

export function canTransitionEpisode(
  episode: EpisodeRecord,
  requestedStage: EpisodeStage,
  guests: GuestRecord[],
): TransitionDecision {
  const currentIndex = stageOrder.indexOf(episode.stage);
  const requestedIndex = stageOrder.indexOf(requestedStage);
  const blockers: string[] = [];

  if (requestedIndex < currentIndex) return { allowed: true, blockers: [] };
  if (requestedIndex > currentIndex + 1) blockers.push('Stages must advance one step at a time.');

  if (requestedIndex >= stageOrder.indexOf('Pre-Production')) {
    if (!episode.recordingDate) blockers.push('Recording date is missing.');
    if (!episode.location) blockers.push('Recording location is missing.');
    if (episode.guestIds.length === 0) blockers.push('At least one guest must be attached.');
    const attached = guests.filter(guest => episode.guestIds.includes(guest.id));
    if (attached.some(guest => guest.status !== 'Confirmed' && guest.status !== 'Recorded' && guest.status !== 'Published')) {
      blockers.push('Every attached guest must be Confirmed before Pre-Production.');
    }
  }

  if (requestedIndex >= stageOrder.indexOf('Production Capture')) {
    const attached = guests.filter(guest => episode.guestIds.includes(guest.id));
    if (attached.some(guest => guest.releaseStatus !== 'Signed' && guest.releaseStatus !== 'Waived with Written Reason')) {
      blockers.push('Guest releases must be signed or formally waived before production.');
    }
  }

  if (requestedIndex >= stageOrder.indexOf('Release')) {
    if (!episode.releaseDate) blockers.push('Release date is missing.');
    if (!allGatesPassed(episode.gates)) blockers.push('All five release gates must pass or have a written waiver.');
    if (episode.completedAssets < 1) blockers.push('At least one approved release asset must exist.');
  }

  return { allowed: blockers.length === 0, blockers };
}

export function assetMatrixIntegrity(episode: EpisodeRecord): { valid: boolean; message?: string } {
  if (episode.targetAssets !== 34) {
    return {
      valid: false,
      message: 'Content matrix integrity warning: configured quantities do not equal the approved target of 34. Review required.',
    };
  }
  return { valid: true };
}

export function releaseReadiness(episode: EpisodeRecord): number {
  const passedGates = episode.gates.filter(gate => gate.status === 'Passed' || gate.status === 'Waived with Written Reason').length;
  const gateScore = passedGates / 5 * 60;
  const assetScore = Math.min(episode.completedAssets / Math.max(episode.targetAssets, 1), 1) * 30;
  const scheduleScore = episode.releaseDate ? 10 : 0;
  return Math.round(gateScore + assetScore + scheduleScore);
}
