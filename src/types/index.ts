export type UserRole =
  | 'founder'
  | 'coo'
  | 'post_production_head'
  | 'social_media_manager'
  | 'production_crew'
  | 'guest'
  | 'sponsor_partner'
  | 'public_viewer';

export type Permission =
  | 'read:episodes'
  | 'write:episodes'
  | 'read:guests'
  | 'write:guests'
  | 'read:media'
  | 'write:media'
  | 'read:analytics'
  | 'read:leads'
  | 'write:leads'
  | 'manage:users'
  | 'manage:settings'
  | 'approve:releases'
  | 'manage:live'
  | 'manage:distribution'
  | 'manage:rights'
  | 'manage:approvals';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type EpisodeStage =
  | 'concept'
  | 'guest_development'
  | 'pre_production'
  | 'production_capture'
  | 'create_and_ingest'
  | 'cut'
  | 'package'
  | 'release'
  | 'amplify'
  | 'learn';

export type EpisodeStatus = 'proposed' | 'confirmed' | 'in_progress' | 'completed' | 'archived';
export type GuestStatus = 'proposed' | 'outreach' | 'confirmed' | 'recorded' | 'released' | 'archived';
export type ReleaseGateStatus = 'pending' | 'in_review' | 'passed' | 'blocked' | 'waived';

export interface ReleaseGateItem {
  status: ReleaseGateStatus;
  ownerId?: string;
  notes?: string;
  updatedAt?: Date;
}

export interface ReleaseGates {
  story: ReleaseGateItem;
  technical: ReleaseGateItem;
  brand: ReleaseGateItem;
  rights: ReleaseGateItem;
  metadata: ReleaseGateItem;
}

export interface Episode {
  id: string;
  seriesNumber: string;
  title: string;
  slug: string;
  description: string;
  stage: EpisodeStage;
  status: EpisodeStatus;
  guestIds: string[];
  recordingDate?: Date;
  releaseDate?: Date;
  releaseGates: ReleaseGates;
  tags: string[];
  tasks: Task[];
  approvals: Approval[];
  featuredImageUrl?: string;
  trailerUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Guest {
  id: string;
  name: string;
  slug: string;
  bio: string;
  topics: string[];
  status: GuestStatus;
  episodeIds: string[];
  headshotUrl?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type AssetType = 'video' | 'audio' | 'image' | 'graphic' | 'transcript' | 'caption' | 'project_file' | 'document';

export interface Asset {
  id: string;
  title: string;
  type: AssetType;
  episodeId?: string;
  guestId?: string;
  storagePath: string;
  contentType: string;
  sizeBytes: number;
  durationSeconds?: number;
  status: 'draft' | 'processing' | 'ready' | 'archived';
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaUpload {
  fileName: string;
  assetType: AssetType;
  episodeId?: string;
  guestId?: string;
  uploadedBy: string;
  notes?: string;
}

export interface TimeCodedComment {
  id: string;
  authorId: string;
  authorName: string;
  timecodeSeconds: number;
  comment: string;
  resolved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewVersion {
  id: string;
  episodeId: string;
  versionLabel: string;
  reviewerIds: string[];
  status: 'draft' | 'in_review' | 'approved' | 'changes_requested';
  comments: TimeCodedComment[];
  exportUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'complete';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Task {
  id: string;
  title: string;
  description?: string;
  ownerId?: string;
  ownerName?: string;
  episodeId?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type ApprovalStatus = 'pending' | 'approved' | 'changes_requested' | 'rejected';

export interface Approval {
  id: string;
  episodeId: string;
  approverId: string;
  approverName: string;
  status: ApprovalStatus;
  notes?: string;
  requestedAt: Date;
  respondedAt?: Date;
}

export interface RightsRecord {
  id: string;
  episodeId: string;
  assetId?: string;
  holderName: string;
  licenseType: 'appearance_release' | 'music' | 'stock' | 'sponsor' | 'ugc';
  clearanceStatus: 'pending' | 'cleared' | 'restricted' | 'expired';
  usageNotes?: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type LivePlatform = 'youtube' | 'twitch' | 'kick' | 'zoom' | 'restream';

export interface LiveEvent {
  id: string;
  title: string;
  episodeId?: string;
  platform: LivePlatform;
  startAt: Date;
  endAt?: Date;
  hostName: string;
  agenda: string[];
  streamKeyConfigured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type IntegrationStatus = 'connected' | 'disconnected' | 'pending' | 'error';

export interface PlatformConnection {
  id: string;
  platform: LivePlatform | 'google_drive' | 'google_calendar' | 'firebase';
  status: IntegrationStatus;
  accountLabel?: string;
  lastCheckedAt?: Date;
  errorMessage?: string;
}

export type DistributionJobStatus = 'queued' | 'processing' | 'scheduled' | 'published' | 'failed' | 'cancelled';

export interface DistributionJob {
  id: string;
  episodeId: string;
  destination: 'spotify' | 'apple_podcasts' | 'youtube' | 'website' | 'newsletter';
  status: DistributionJobStatus;
  scheduledFor?: Date;
  publishedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Keyword {
  term: string;
  intent?: 'discover' | 'listen' | 'share' | 'convert';
  volumeBand?: 'niche' | 'growing' | 'evergreen';
}

export interface MetadataPackage {
  episodeId: string;
  title: string;
  description: string;
  keywords: Keyword[];
  showNotes: string[];
  chapters?: Array<{ timecode: string; title: string }>;
  socialHooks: string[];
  callToAction: string;
}

export interface SocialPost {
  id: string;
  platform: 'instagram' | 'tiktok' | 'facebook' | 'linkedin' | 'youtube';
  caption: string;
  assetId?: string;
  scheduledFor?: Date;
  status: 'draft' | 'scheduled' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

export type LeadSource = 'website' | 'newsletter' | 'partner_referral' | 'social_dm' | 'live_event' | 'guest_referral' | 'organic_search';

export interface Lead {
  id: string;
  name: string;
  email: string;
  source: LeadSource;
  interest: 'guest' | 'partner' | 'sponsor' | 'community' | 'listener';
  notes?: string;
  ownerId?: string;
  status: 'new' | 'qualified' | 'nurturing' | 'converted' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  entityType: 'episode' | 'guest' | 'asset' | 'approval' | 'task' | 'settings';
  entityId: string;
  metadata?: Record<string, string | number | boolean | null>;
  createdAt: Date;
}
