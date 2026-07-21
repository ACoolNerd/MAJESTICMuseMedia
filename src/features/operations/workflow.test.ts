import { describe, expect, it } from 'vitest';
import { seedEpisodes, seedGuests } from './seed';
import { assetMatrixIntegrity, canConfirmStatus, canTransitionEpisode, releaseReadiness } from './workflow';

describe('episode workflow guardrails', () => {
  it('prevents non-executives from confirming proposed records', () => {
    const decision = canConfirmStatus('Proposed', 'Confirmed', 'social');
    expect(decision.allowed).toBe(false);
    expect(decision.blockers[0]).toMatch(/executive/i);
  });

  it('allows executive confirmation while preserving an explicit action', () => {
    expect(canConfirmStatus('Proposed', 'Confirmed', 'ceo').allowed).toBe(true);
    expect(canConfirmStatus('TBD', 'Confirmed', 'coo').allowed).toBe(true);
  });

  it('blocks production when guest releases are not cleared', () => {
    const episode = { ...seedEpisodes[0], stage: 'Pre-Production' as const, location: 'Approved studio' };
    const decision = canTransitionEpisode(episode, 'Production Capture', seedGuests);
    expect(decision.allowed).toBe(false);
    expect(decision.blockers.join(' ')).toMatch(/release/i);
  });

  it('blocks release while any mandatory gate remains incomplete', () => {
    const episode = { ...seedEpisodes[0], stage: 'Package' as const };
    const decision = canTransitionEpisode(episode, 'Release', seedGuests);
    expect(decision.allowed).toBe(false);
    expect(decision.blockers.join(' ')).toMatch(/five release gates/i);
  });

  it('warns when the configured asset target does not equal 34', () => {
    expect(assetMatrixIntegrity({ ...seedEpisodes[0], targetAssets: 60 }).valid).toBe(false);
  });

  it('calculates readiness from gates, assets and schedule', () => {
    const score = releaseReadiness(seedEpisodes[0]);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(100);
  });
});
