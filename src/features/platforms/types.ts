export type PlatformName = 'YouTube' | 'Twitch' | 'KICK';
export type ConnectionState = 'Connection Required' | 'Connected' | 'Degraded' | 'Expired' | 'Disabled';

export interface PlatformCapabilities {
  canSchedule: boolean;
  canCreateLiveEvent: boolean;
  canBindStream: boolean;
  canTransitionLiveState: boolean;
  canReadComments: boolean;
  canReplyToComments: boolean;
  canReadLiveChat: boolean;
  canSendLiveChat: boolean;
  canModerateChat: boolean;
  canUploadVideo: boolean;
  canReadAnalytics: boolean;
  canEmbedPlayer: boolean;
}

export interface PlatformConnectionRecord {
  id: string;
  platform: PlatformName;
  state: ConnectionState;
  accountLabel?: string;
  externalAccountId?: string;
  scopes: string[];
  capabilities: PlatformCapabilities;
  expiresAt?: string;
  lastCheckedAt?: string;
  lastError?: string;
  testMode: boolean;
}

export interface LiveEventRecord {
  id: string;
  episodeId: string;
  title: string;
  scheduledStart: string;
  scheduledEnd?: string;
  status: 'Draft' | 'Ready' | 'Scheduled' | 'Testing' | 'Live' | 'Complete' | 'Cancelled' | 'Blocked';
  platforms: PlatformName[];
  runOfShow: Array<{ time: string; segment: string; owner: string }>;
  pinnedCta: string;
  disclosure?: string;
  moderatorNames: string[];
  externalRefs: Partial<Record<PlatformName, {
    eventId?: string;
    streamId?: string;
    liveChatId?: string;
    publicUrl?: string;
    replayUrl?: string;
  }>>;
  createdAt: string;
  updatedAt: string;
}

export interface DistributionJobRecord {
  id: string;
  episodeId: string;
  assetId: string;
  platform: PlatformName;
  action: 'Create Live Event' | 'Update Metadata' | 'Upload Video' | 'Publish Comment' | 'Schedule Segment';
  status: 'Draft' | 'Waiting Approval' | 'Approved' | 'Processing' | 'Succeeded' | 'Failed' | 'Cancelled';
  requestedByUid: string;
  approvedByUid?: string;
  attempts: number;
  idempotencyKey: string;
  scheduledAt?: string;
  lastAttemptAt?: string;
  externalId?: string;
  returnedVisibility?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdapterHealth {
  platform: PlatformName;
  state: ConnectionState;
  checkedAt: string;
  message: string;
  capabilities: PlatformCapabilities;
}

export interface CreateLiveEventInput {
  title: string;
  description: string;
  scheduledStart: string;
  scheduledEnd?: string;
  privacy: 'private' | 'unlisted' | 'public';
  madeForChildren?: boolean;
}

export interface CreateLiveEventResult {
  externalEventId: string;
  externalStreamId?: string;
  publicUrl?: string;
  returnedState: string;
}

export interface PlatformAdapter {
  readonly platform: PlatformName;
  readonly capabilities: PlatformCapabilities;
  checkHealth(connection: PlatformConnectionRecord): Promise<AdapterHealth>;
  createLiveEvent(connection: PlatformConnectionRecord, input: CreateLiveEventInput): Promise<CreateLiveEventResult>;
}
