export type MediaKind = 'Original' | 'Proxy' | 'Review Export' | 'Final Master' | 'Audio Master' | 'Caption' | 'Still' | 'Derivative';
export type MediaStatus = 'Uploaded' | 'Validating' | 'Ready for Review' | 'Changes Requested' | 'Approved' | 'Archived';

export interface MediaAssetRecord {
  id: string;
  episodeId: string;
  name: string;
  kind: MediaKind;
  status: MediaStatus;
  mimeType: string;
  sizeBytes: number;
  durationSeconds?: number;
  width?: number;
  height?: number;
  checksum?: string;
  storagePath?: string;
  downloadUrl?: string;
  backupVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewVersionRecord {
  id: string;
  episodeId: string;
  assetId: string;
  label: string;
  status: 'Open' | 'Changes Requested' | 'Approved';
  createdAt: string;
}

export type CommentCategory = 'Story' | 'Remove' | 'Shorten' | 'Fact check' | 'Rights concern' | 'Audio' | 'Color' | 'Graphic' | 'Caption' | 'Brand' | 'CTA' | 'Clip candidate';
export type CommentSeverity = 'Note' | 'Important' | 'Blocking';

export interface TimecodedCommentRecord {
  id: string;
  versionId: string;
  episodeId: string;
  authorUid: string;
  authorName: string;
  timeSeconds: number;
  category: CommentCategory;
  severity: CommentSeverity;
  body: string;
  resolved: boolean;
  createdAt: string;
  resolvedAt?: string;
}

export interface ClipCandidate {
  id: string;
  startSeconds: number;
  endSeconds: number;
  hook: string;
  topic: string;
  platform: 'YouTube Shorts' | 'Instagram Reels' | 'TikTok' | 'LinkedIn' | 'Facebook';
  aspectRatio: '9:16' | '4:5' | '1:1' | '16:9';
  cta: string;
}

export interface CapCutPacket {
  episodeId: string;
  generatedAt: string;
  sequenceName: string;
  sourceAssets: string[];
  transcriptStatus: 'Missing' | 'Available';
  captionStatus: 'Missing' | 'Available';
  coldOpen: string;
  storyOutline: string[];
  removeNotes: string[];
  rightsFlags: string[];
  lowerThirds: string[];
  clipCandidates: ClipCandidate[];
  exportPresets: Array<{ name: string; ratio: string; resolution: string; codec: string }>;
  fileNamingPattern: string;
}
