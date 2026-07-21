import { describe, expect, it } from 'vitest';
import { seedEpisodes } from '../operations/seed';
import { seedMediaAssets, seedReviewComments } from './seed';
import { commentsToRevisionList, formatTimecode, generateCapCutPacket, validateFinalMaster } from './workflow';

describe('media workflow', () => {
  it('formats review timecodes consistently', () => {
    expect(formatTimecode(0)).toBe('00:00:00');
    expect(formatTimecode(3661)).toBe('01:01:01');
  });

  it('sorts unresolved review comments into a revision list', () => {
    const list = commentsToRevisionList([...seedReviewComments].reverse());
    expect(list[0]).toMatch(/^00:00:18/);
    expect(list[1]).toMatch(/^00:06:52/);
    expect(list).toHaveLength(3);
  });

  it('blocks a review export from masquerading as a final master', () => {
    const result = validateFinalMaster(seedMediaAssets[1]);
    expect(result.valid).toBe(false);
    expect(result.blockers.join(' ')).toMatch(/Final Master/);
  });

  it('requires checksum and backup evidence for a final master', () => {
    const result = validateFinalMaster({
      ...seedMediaAssets[1],
      kind: 'Final Master',
      checksum: undefined,
      backupVerified: false,
    });
    expect(result.valid).toBe(false);
    expect(result.blockers.join(' ')).toMatch(/Checksum/);
    expect(result.blockers.join(' ')).toMatch(/Backup/);
  });

  it('generates a controlled CapCut packet with all required aspect ratios', () => {
    const packet = generateCapCutPacket(seedEpisodes[0], seedMediaAssets, seedReviewComments);
    expect(packet.exportPresets.map(item => item.ratio)).toEqual(['16:9', '9:16', '4:5', '1:1']);
    expect(packet.fileNamingPattern).toContain('S01E01');
    expect(packet.clipCandidates.length).toBeGreaterThan(0);
    expect(packet.sourceAssets).toContain('S01E01_CAM_A_ORIGINAL.mov');
  });
});
