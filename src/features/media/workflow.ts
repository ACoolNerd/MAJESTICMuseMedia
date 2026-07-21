import type { EpisodeRecord } from '../operations/types';
import type { CapCutPacket, ClipCandidate, MediaAssetRecord, TimecodedCommentRecord } from './types';

export interface ValidationResult {
  valid: boolean;
  warnings: string[];
  blockers: string[];
}

export function validateFinalMaster(asset: MediaAssetRecord): ValidationResult {
  const blockers: string[] = [];
  const warnings: string[] = [];

  if (asset.kind !== 'Final Master') blockers.push('The selected asset is not labeled Final Master.');
  if (!asset.checksum) blockers.push('Checksum evidence is missing.');
  if (!asset.backupVerified) blockers.push('Backup verification is missing.');
  if (!asset.durationSeconds || asset.durationSeconds < 60) blockers.push('Duration is missing or implausibly short.');
  if (!asset.width || !asset.height) blockers.push('Video dimensions are missing.');
  if (asset.mimeType !== 'video/mp4' && asset.mimeType !== 'video/quicktime') blockers.push('Unsupported final-master media type.');
  if (asset.width && asset.height && asset.width / asset.height < 1.7) warnings.push('Primary master is not close to a 16:9 landscape ratio.');
  if (asset.status !== 'Approved') warnings.push('Final master has not received an Approved status.');

  return { valid: blockers.length === 0, warnings, blockers };
}

export function formatTimecode(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const remaining = safe % 60;
  return [hours, minutes, remaining].map(value => value.toString().padStart(2, '0')).join(':');
}

export function commentsToRevisionList(comments: TimecodedCommentRecord[]): string[] {
  return comments
    .filter(comment => !comment.resolved)
    .sort((a, b) => a.timeSeconds - b.timeSeconds)
    .map(comment => `${formatTimecode(comment.timeSeconds)} | ${comment.severity} | ${comment.category} | ${comment.body}`);
}

function defaultClips(episode: EpisodeRecord): ClipCandidate[] {
  return [
    { id: `${episode.id}-clip-1`, startSeconds: 18, endSeconds: 63, hook: 'Identity changes when you stop accepting borrowed definitions.', topic: episode.theme, platform: 'YouTube Shorts', aspectRatio: '9:16', cta: `Watch ${episode.code} at MAJESTICMuseMedia.ai` },
    { id: `${episode.id}-clip-2`, startSeconds: 1180, endSeconds: 1225, hook: 'A clear calling still requires courage and structure.', topic: episode.theme, platform: 'Instagram Reels', aspectRatio: '9:16', cta: 'Join the MAJESTIC Muse community' },
    { id: `${episode.id}-clip-3`, startSeconds: 1760, endSeconds: 1815, hook: 'Purpose becomes practical through the next faithful action.', topic: episode.theme, platform: 'LinkedIn', aspectRatio: '4:5', cta: 'Read the full episode notes' },
  ];
}

export function generateCapCutPacket(
  episode: EpisodeRecord,
  assets: MediaAssetRecord[],
  comments: TimecodedCommentRecord[],
): CapCutPacket {
  const episodeAssets = assets.filter(asset => asset.episodeId === episode.id);
  const revisionList = commentsToRevisionList(comments.filter(comment => comment.episodeId === episode.id));
  const rightsFlags = comments
    .filter(comment => comment.episodeId === episode.id && comment.category === 'Rights concern' && !comment.resolved)
    .map(comment => `${formatTimecode(comment.timeSeconds)} — ${comment.body}`);

  return {
    episodeId: episode.id,
    generatedAt: new Date().toISOString(),
    sequenceName: `${episode.code}_${episode.title.replace(/[^a-z0-9]+/gi, '_').toUpperCase()}_MASTER`,
    sourceAssets: episodeAssets.filter(asset => ['Original', 'Proxy', 'Audio Master', 'Still'].includes(asset.kind)).map(asset => asset.name),
    transcriptStatus: 'Missing',
    captionStatus: episodeAssets.some(asset => asset.kind === 'Caption') ? 'Available' : 'Missing',
    coldOpen: `Open with the strongest source-grounded statement that proves the promise: ${episode.audiencePromise}`,
    storyOutline: ['Cold open', 'Host welcome and guest context', 'Origin story', 'Core transformation', 'Practical framework', 'Closing reflection and MAJESTICMuseMedia.ai CTA'],
    removeNotes: revisionList.filter(item => item.includes('| Remove |') || item.includes('| Shorten |')),
    rightsFlags,
    lowerThirds: episode.guestNames.map(name => `${name} — approved title required`),
    clipCandidates: defaultClips(episode),
    exportPresets: [
      { name: 'YouTube Master', ratio: '16:9', resolution: '3840x2160 or 1920x1080', codec: 'H.264 high bitrate' },
      { name: 'Vertical Master', ratio: '9:16', resolution: '1080x1920', codec: 'H.264' },
      { name: 'Feed Portrait', ratio: '4:5', resolution: '1080x1350', codec: 'H.264' },
      { name: 'Square', ratio: '1:1', resolution: '1080x1080', codec: 'H.264' },
    ],
    fileNamingPattern: `${episode.code}_{ASSET}_{VERSION}_{RATIO}.{ext}`,
  };
}
