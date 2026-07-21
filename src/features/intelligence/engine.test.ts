import { describe, expect, it } from 'vitest';
import { seedMediaAssets, seedReviewComments } from '../media/seed';
import { seedEpisodes, seedGuests } from '../operations/seed';
import { seedDistributionJobs, seedPlatformConnections } from '../platforms/seed';
import { askMuse } from './engine';

const state = {
  episodes: seedEpisodes,
  guests: seedGuests,
  assets: seedMediaAssets,
  comments: seedReviewComments,
  connections: seedPlatformConnections,
  jobs: seedDistributionJobs,
};

describe('Muse Intelligence grounding', () => {
  it('reports missing guest materials from loaded records', () => {
    const answer = askMuse('Which guest materials are missing?', state);
    expect(answer.answer).toMatch(/guest record/);
    expect(answer.facts.some(item => item.includes('Rebecca'))).toBe(true);
    expect(answer.citations.length).toBeGreaterThan(0);
    expect(answer.confidence).toBeGreaterThan(0.9);
  });

  it('reports incomplete release gates instead of inventing readiness', () => {
    const answer = askMuse('What needs Marchette’s approval today?', state);
    expect(answer.facts.join(' ')).toMatch(/Rights=Blocked/);
    expect(answer.requiresApproval).toBe(true);
  });

  it('does not invent a final master', () => {
    const answer = askMuse('Where is the latest final master?', state);
    expect(answer.answer).toMatch(/No asset is currently labeled Final Master/);
    expect(answer.missingInformation).toContain('Approved final-master record');
  });

  it('shows disconnected platform truth', () => {
    const answer = askMuse('What is the platform connection status?', state);
    expect(answer.answer).toMatch(/0 of 3/);
    expect(answer.facts.join(' ')).toMatch(/Connection Required/);
  });

  it('returns low confidence for an unsupported question', () => {
    const answer = askMuse('Predict next year’s revenue without assumptions.', state);
    expect(answer.confidence).toBeLessThan(0.5);
    expect(answer.missingInformation.length).toBeGreaterThan(0);
  });
});
