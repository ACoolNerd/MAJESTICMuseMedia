import { describe, expect, it } from 'vitest';
import { seedEpisodes, seedGuests } from './seed-data';

describe('seed data', () => {
  describe('seedEpisodes', () => {
    it('has 4 episodes', () => {
      expect(seedEpisodes).toHaveLength(4);
    });

    it('S01E01 is confirmed and in production_capture stage', () => {
      const episode = seedEpisodes.find((item) => item.seriesNumber === 'S01E01');
      expect(episode).toBeDefined();
      expect(episode?.status).toBe('confirmed');
      expect(episode?.stage).toBe('production_capture');
    });

    it('S01E01 has recording date July 24 2026', () => {
      const episode = seedEpisodes.find((item) => item.seriesNumber === 'S01E01');
      expect(episode?.recordingDate).toBeDefined();
      expect(episode?.recordingDate?.getFullYear()).toBe(2026);
      expect(episode?.recordingDate?.getMonth()).toBe(6);
      expect(episode?.recordingDate?.getDate()).toBe(24);
    });

    it('all episodes have release gates', () => {
      seedEpisodes.forEach((episode) => {
        expect(episode.releaseGates).toBeDefined();
        expect(episode.releaseGates.story).toBeDefined();
        expect(episode.releaseGates.technical).toBeDefined();
        expect(episode.releaseGates.brand).toBeDefined();
        expect(episode.releaseGates.rights).toBeDefined();
        expect(episode.releaseGates.metadata).toBeDefined();
      });
    });
  });

  describe('seedGuests', () => {
    it('has 4 guests', () => {
      expect(seedGuests).toHaveLength(4);
    });

    it('Rebecca is confirmed', () => {
      const guest = seedGuests.find((item) => item.name === 'Rebecca');
      expect(guest?.status).toBe('confirmed');
    });
  });
});
