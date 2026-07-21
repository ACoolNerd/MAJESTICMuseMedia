import { describe, expect, it } from 'vitest';
import { hasPermission } from '../auth/permissions';
import { seedApprovals, seedCalendarItems, seedRasci, seedRights, seedTasks } from './seed';
import { canConfirmStatus } from './workflow';

function hasAccountableAndResponsible(assignments: Record<string, string>): boolean {
  const values = Object.values(assignments);
  return values.some(value => value.includes('A')) && values.some(value => value.includes('R'));
}

describe('operational control records', () => {
  it('retains the documented 22-workstream RASCI baseline', () => {
    expect(seedRasci).toHaveLength(22);
  });

  it('surfaces incomplete accountability rather than silently repairing it', () => {
    const incomplete = seedRasci.filter(record => !hasAccountableAndResponsible(record.assignments));
    expect(incomplete.some(record => record.workstream === 'Guest approval')).toBe(true);
  });

  it('keeps proposed dates unconfirmed until an executive action', () => {
    const proposed = seedCalendarItems.filter(item => item.status === 'Proposed');
    expect(proposed.length).toBeGreaterThan(0);
    expect(canConfirmStatus('Proposed', 'Confirmed', 'social').allowed).toBe(false);
    expect(canConfirmStatus('Proposed', 'Confirmed', 'coo').allowed).toBe(true);
  });

  it('keeps the first release blocked by incomplete rights evidence', () => {
    const record = seedRights.find(item => item.episodeId === 's01e01');
    expect(record?.guestRelease).toBe('Pending');
    expect(record?.imageRights).toBe('Pending');
    expect(record?.sensitiveInformationReview).toBe('Pending');
  });

  it('does not pre-approve final release authority', () => {
    const releaseApproval = seedApprovals.find(item => item.type === 'Release');
    expect(releaseApproval?.requestedFromRole).toBe('ceo');
    expect(releaseApproval?.status).toBe('Pending');
  });

  it('gives metadata owners approval workflow access without final editorial authority', () => {
    expect(hasPermission('social', 'approvals.manage')).toBe(true);
    expect(hasPermission('social', 'editorial.final')).toBe(false);
  });

  it('contains explicit critical blockers with assigned roles', () => {
    const critical = seedTasks.filter(task => task.priority === 'Critical');
    expect(critical.length).toBeGreaterThan(0);
    expect(critical.every(task => Boolean(task.assignedRole))).toBe(true);
  });
});
