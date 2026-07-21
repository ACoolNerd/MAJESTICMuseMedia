import { platformCapabilities } from './adapters';
import type { DistributionJobRecord, LiveEventRecord, PlatformConnectionRecord } from './types';

const now = '2026-07-21T00:00:00.000Z';

export const seedPlatformConnections: PlatformConnectionRecord[] = [
  { id: 'youtube', platform: 'YouTube', state: 'Connection Required', scopes: [], capabilities: platformCapabilities.YouTube, lastCheckedAt: now, testMode: false },
  { id: 'twitch', platform: 'Twitch', state: 'Connection Required', scopes: [], capabilities: platformCapabilities.Twitch, lastCheckedAt: now, testMode: false },
  { id: 'kick', platform: 'KICK', state: 'Connection Required', scopes: [], capabilities: platformCapabilities.KICK, lastCheckedAt: now, testMode: false },
];

export const seedLiveEvents: LiveEventRecord[] = [
  {
    id: 's01e01-live',
    episodeId: 's01e01',
    title: 'MAJESTIC Muse LIVE — IDENTITY',
    scheduledStart: '2026-08-01T19:00:00-04:00',
    scheduledEnd: '2026-08-01T20:30:00-04:00',
    status: 'Draft',
    platforms: ['YouTube', 'Twitch', 'KICK'],
    runOfShow: [
      { time: '00:00', segment: 'Holding slide and sound check', owner: 'Brian' },
      { time: '05:00', segment: 'Marchette welcome and purpose', owner: 'Marchette' },
      { time: '10:00', segment: 'IDENTITY conversation', owner: 'Marchette' },
      { time: '60:00', segment: 'Community questions and CTA', owner: 'Ares' },
      { time: '80:00', segment: 'Closing and replay confirmation', owner: 'Keith' },
    ],
    pinnedCta: 'Watch, subscribe and join the community at MAJESTICMuseMedia.ai',
    moderatorNames: ['Ares Schwager'],
    externalRefs: {},
    createdAt: now,
    updatedAt: now,
  },
];

export const seedDistributionJobs: DistributionJobRecord[] = [
  {
    id: 'job-s01e01-youtube-live', episodeId: 's01e01', assetId: 's01e01-review-v1', platform: 'YouTube',
    action: 'Create Live Event', status: 'Draft', requestedByUid: 'demo-coo', attempts: 0,
    idempotencyKey: 's01e01-youtube-create-live-v1', scheduledAt: '2026-08-01T19:00:00-04:00', createdAt: now, updatedAt: now,
  },
  {
    id: 'job-s01e01-twitch-schedule', episodeId: 's01e01', assetId: 's01e01-review-v1', platform: 'Twitch',
    action: 'Schedule Segment', status: 'Draft', requestedByUid: 'demo-social', attempts: 0,
    idempotencyKey: 's01e01-twitch-schedule-v1', scheduledAt: '2026-08-01T19:00:00-04:00', createdAt: now, updatedAt: now,
  },
];
