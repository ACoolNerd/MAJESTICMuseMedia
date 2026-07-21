import type { MediaAssetRecord, ReviewVersionRecord, TimecodedCommentRecord } from './types';

const now = '2026-07-21T00:00:00.000Z';

export const seedMediaAssets: MediaAssetRecord[] = [
  { id: 's01e01-original-a', episodeId: 's01e01', name: 'S01E01_CAM_A_ORIGINAL.mov', kind: 'Original', status: 'Uploaded', mimeType: 'video/quicktime', sizeBytes: 48_200_000_000, durationSeconds: 3120, width: 3840, height: 2160, checksum: 'pending-production-checksum', storagePath: 'episodes/s01e01/originals/CAM_A.mov', backupVerified: true, createdAt: now, updatedAt: now },
  { id: 's01e01-review-v1', episodeId: 's01e01', name: 'S01E01_REVIEW_V1.mp4', kind: 'Review Export', status: 'Ready for Review', mimeType: 'video/mp4', sizeBytes: 1_850_000_000, durationSeconds: 2840, width: 1920, height: 1080, checksum: 'demo-review-checksum', storagePath: 'episodes/s01e01/review/V1.mp4', backupVerified: true, createdAt: now, updatedAt: now },
  { id: 's01e01-captions', episodeId: 's01e01', name: 'S01E01_CAPTIONS.srt', kind: 'Caption', status: 'Changes Requested', mimeType: 'application/x-subrip', sizeBytes: 84_000, storagePath: 'episodes/s01e01/captions/S01E01.srt', backupVerified: true, createdAt: now, updatedAt: now },
];

export const seedReviewVersions: ReviewVersionRecord[] = [
  { id: 's01e01-v1', episodeId: 's01e01', assetId: 's01e01-review-v1', label: 'V1', status: 'Open', createdAt: now },
];

export const seedReviewComments: TimecodedCommentRecord[] = [
  { id: 'comment-1', versionId: 's01e01-v1', episodeId: 's01e01', authorUid: 'demo-ceo', authorName: 'Marchette', timeSeconds: 18, category: 'Story', severity: 'Important', body: 'Open faster on the identity promise before the introduction.', resolved: false, createdAt: now },
  { id: 'comment-2', versionId: 's01e01-v1', episodeId: 's01e01', authorUid: 'demo-post', authorName: 'Brian Schwager', timeSeconds: 412, category: 'Audio', severity: 'Blocking', body: 'Remove the transient noise and confirm the repaired audio before final approval.', resolved: false, createdAt: now },
  { id: 'comment-3', versionId: 's01e01-v1', episodeId: 's01e01', authorUid: 'demo-social', authorName: 'Ares Schwager', timeSeconds: 1180, category: 'Clip candidate', severity: 'Note', body: 'Strong 45-second identity clip for vertical distribution.', resolved: false, createdAt: now },
];
