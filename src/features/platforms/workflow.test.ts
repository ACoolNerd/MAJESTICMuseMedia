import { describe, expect, it } from 'vitest';
import { seedEpisodes } from '../operations/seed';
import { actionAvailability, createPlatformAdapter, platformCapabilities } from './adapters';
import { seedDistributionJobs, seedPlatformConnections } from './seed';
import { canApproveDistributionJob, canExecuteDistributionJob, verifyReturnedState } from './workflow';

describe('platform capability contracts', () => {
  it('exposes only declared platform actions', () => {
    expect(actionAvailability(platformCapabilities.YouTube)).toContain('Create live event');
    expect(actionAvailability(platformCapabilities.Twitch)).not.toContain('Upload video');
    expect(actionAvailability(platformCapabilities.KICK)).not.toContain('Create live event');
  });

  it('does not send production requests from the browser adapter', async () => {
    const connection = { ...seedPlatformConnections[0], state: 'Connected' as const, testMode: false };
    await expect(createPlatformAdapter('YouTube').createLiveEvent(connection, {
      title: 'Test', description: 'Test', scheduledStart: new Date().toISOString(), privacy: 'private',
    })).rejects.toThrow(/trusted server adapter/i);
  });

  it('returns an explicit test state without an external request', async () => {
    const connection = { ...seedPlatformConnections[0], testMode: true };
    const result = await createPlatformAdapter('YouTube').createLiveEvent(connection, {
      title: 'Test', description: 'Test', scheduledStart: new Date().toISOString(), privacy: 'private',
    });
    expect(result.returnedState).toBe('test-created:private');
    expect(result.externalEventId).toMatch(/^test-youtube-/);
  });
});

describe('distribution approval and truth rules', () => {
  it('reserves final publishing approval for the CEO', () => {
    const decision = canApproveDistributionJob(
      seedDistributionJobs[0], seedEpisodes[0], { ...seedPlatformConnections[0], testMode: true }, 'coo',
    );
    expect(decision.allowed).toBe(false);
    expect(decision.blockers.join(' ')).toMatch(/CEO/);
  });

  it('blocks approval while release gates are incomplete', () => {
    const decision = canApproveDistributionJob(
      seedDistributionJobs[0], seedEpisodes[0], { ...seedPlatformConnections[0], testMode: true }, 'ceo',
    );
    expect(decision.allowed).toBe(false);
    expect(decision.blockers.join(' ')).toMatch(/Release gates incomplete/);
  });

  it('requires approved status before execution', () => {
    expect(canExecuteDistributionJob(seedDistributionJobs[0], { ...seedPlatformConnections[0], testMode: true }).allowed).toBe(false);
  });

  it('does not equate upload success with public visibility', () => {
    const decision = verifyReturnedState({
      ...seedDistributionJobs[0], action: 'Upload Video', status: 'Succeeded', externalId: 'video-1', returnedVisibility: undefined,
    });
    expect(decision.allowed).toBe(false);
    expect(decision.blockers.join(' ')).toMatch(/visibility/i);
  });
});
