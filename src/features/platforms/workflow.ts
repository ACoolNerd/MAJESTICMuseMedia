import type { Role } from '../../types';
import type { EpisodeRecord } from '../operations/types';
import type { DistributionJobRecord, PlatformConnectionRecord } from './types';

export interface DistributionDecision {
  allowed: boolean;
  blockers: string[];
}

export function canApproveDistributionJob(
  job: DistributionJobRecord,
  episode: EpisodeRecord | undefined,
  connection: PlatformConnectionRecord | undefined,
  role: Role,
): DistributionDecision {
  const blockers: string[] = [];
  if (role !== 'ceo') blockers.push('Only the CEO / Executive Producer may provide final publishing approval.');
  if (!episode) blockers.push('The linked episode record is missing.');
  if (!connection) blockers.push('The platform connection record is missing.');
  if (connection && connection.state !== 'Connected' && !connection.testMode) blockers.push(`${connection.platform} connection required.`);
  if (episode) {
    const incomplete = episode.gates.filter(gate => gate.status !== 'Passed' && gate.status !== 'Waived with Written Reason');
    if (incomplete.length) blockers.push(`Release gates incomplete: ${incomplete.map(gate => gate.name).join(', ')}.`);
  }
  if (!job.idempotencyKey) blockers.push('Idempotency key is missing.');
  return { allowed: blockers.length === 0, blockers };
}

export function canExecuteDistributionJob(
  job: DistributionJobRecord,
  connection: PlatformConnectionRecord | undefined,
): DistributionDecision {
  const blockers: string[] = [];
  if (job.status !== 'Approved') blockers.push('The distribution job is not approved.');
  if (!connection) blockers.push('Platform connection is missing.');
  if (connection && connection.state !== 'Connected' && !connection.testMode) blockers.push(`${connection.platform} connection required.`);
  if (job.attempts >= 5) blockers.push('Retry limit reached. Manual review required.');
  return { allowed: blockers.length === 0, blockers };
}

export function verifyReturnedState(job: DistributionJobRecord): DistributionDecision {
  const blockers: string[] = [];
  if (job.status !== 'Succeeded') blockers.push('The platform action has not succeeded.');
  if (!job.externalId) blockers.push('The platform did not return an external identifier.');
  if (job.action === 'Upload Video' && !job.returnedVisibility) {
    blockers.push('Returned visibility is missing; upload success must not be treated as public publication.');
  }
  return { allowed: blockers.length === 0, blockers };
}
