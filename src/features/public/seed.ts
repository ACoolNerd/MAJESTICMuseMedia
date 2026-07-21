import type { PublicArticleRecord, PublicClipRecord, PublicEpisodeRecord, PublicGuestRecord, PublicLiveRecord } from './types';

const now = '2026-07-21T00:00:00.000Z';

export const seedPublicEpisodes: PublicEpisodeRecord[] = [
  {
    id: 's01e01',
    code: 'S01E01',
    slug: 'identity',
    title: 'IDENTITY',
    summary: 'An upcoming MAJESTIC Muse conversation about identity, faith and purpose. Final media, transcript, guest biography and public links remain pending approval.',
    theme: 'Identity, faith and purpose',
    status: 'Upcoming',
    releaseAt: '2026-08-01T19:00:00-04:00',
    guestIds: ['rebecca'],
    guestNames: ['Rebecca'],
    transcriptStatus: 'Pending Approval',
    chapters: [],
    resources: [],
    ctaLabel: 'Join the MAJESTIC Muse community',
    ctaUrl: '/newsletter?source=episode-identity',
    sourceReference: 'Production Control Center — Scheduled; public media pending approval',
    updatedAt: now,
  },
];

export const seedPublicGuests: PublicGuestRecord[] = [
  {
    id: 'rebecca',
    slug: 'rebecca',
    name: 'Rebecca',
    episodeIds: ['s01e01'],
    socialLinks: [],
    sourceReference: 'Production Control Center — name and episode association only; biography pending approval',
    updatedAt: now,
  },
];

export const seedPublicClips: PublicClipRecord[] = [];
export const seedPublicArticles: PublicArticleRecord[] = [];

export const seedPublicLive: PublicLiveRecord = {
  id: 'current-live',
  title: 'MAJESTIC Muse Live',
  status: 'No Event',
  description: 'No public livestream has been verified. Confirmed platform links will appear here after executive approval and platform validation.',
  platformLinks: [],
  updatedAt: now,
};
