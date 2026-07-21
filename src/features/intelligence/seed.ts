import type { AnalyticsSnapshot, LeadRecord, RepurposingMoment, SourceRecord } from './types';

const now = '2026-07-21T00:00:00.000Z';

export const sourceRegistry: SourceRecord[] = [
  { id: 'production-control-center', title: 'MAJESTIC Muse Podcast by Marchette — Production Control Center', priority: 1, type: 'Control Center', status: 'System Evidence', updatedAt: now, summary: 'Primary operating truth for calendar, pipeline, ownership, stages, release status and KPIs.' },
  { id: 'master-operating-source', title: 'MAJESTIC Muse Master Operating System Source', priority: 2, type: 'Operating Source', status: 'System Evidence', updatedAt: now, summary: 'Narrative authority for brand, governance, workflow, release gates and operating definitions.' },
  { id: 'master-operating-workbook', title: 'MAJESTIC Muse Master Operating System', priority: 3, type: 'Workbook', status: 'System Evidence', updatedAt: now, summary: 'Structured worksheets for calendar, guest pipeline, RASCI, assets, goals and KPIs.' },
  { id: 'operating-walkthrough', title: 'MAJESTIC Muse Operating System Walkthrough', priority: 4, type: 'Walkthrough', status: 'System Evidence', updatedAt: now, summary: 'Implementation and verification guide for the operating system.' },
  { id: 'approved-executive-media', title: 'Approved Executive Media Library', priority: 5, type: 'Approved Media', status: 'System Evidence', updatedAt: now, summary: 'Visual authority for approved real photography and likeness-preserving design.' },
  { id: 'episode-transcripts', title: 'Approved Episode Transcripts', priority: 6, type: 'Transcript', status: 'TBD', updatedAt: now, summary: 'Episode-specific source for quotes, chapters, clips and content analysis after approval.' },
  { id: 'signed-guest-materials', title: 'Signed Guest Materials', priority: 6, type: 'Guest Material', status: 'TBD', updatedAt: now, summary: 'Approved biographies, titles, links, corrections, consent and promotional commitments.' },
  { id: 'legacy-archive', title: 'Archived Legacy Material', priority: 7, type: 'Archive', status: 'System Evidence', updatedAt: now, summary: 'Historical context only; cannot override active operating sources.' },
];

export const seedAnalytics: AnalyticsSnapshot[] = [
  { id: 's01e01-manual-baseline', episodeId: 's01e01', source: 'Manual', period: '24h', capturedAt: now, coverageThrough: now, metrics: { impressions: 0, views: 0, watchMinutes: 0, websiteConversions: 0 }, notes: 'Planning placeholder only. No platform data connected.' },
];

export const seedLeads: LeadRecord[] = [
  { id: 'lead-guest-pipeline', name: 'Guest pipeline follow-up', leadType: 'Guest', status: 'Reviewing', source: 'Production Control Center', assignedRole: 'coo', consent: true, score: 60, nextAction: 'Verify proposed guest status and missing materials.', dueDate: '2026-07-24', createdAt: now, updatedAt: now },
  { id: 'lead-partnership-starter', name: 'Qualified partnership conversation target', leadType: 'Sponsor', status: 'New', source: 'Operating KPI target', assignedRole: 'ceo', consent: false, score: 25, nextAction: 'Identify aligned organizations before outreach.', createdAt: now, updatedAt: now },
];

export const seedMoments: RepurposingMoment[] = [
  { id: 's01e01-moment-1', episodeId: 's01e01', startSeconds: 18, endSeconds: 63, speaker: 'Transcript required', hook: 'Identity changes when you stop accepting borrowed definitions.', topic: 'Identity, faith and purpose', emotionalTone: 'Reflective', audience: 'People seeking clarity about identity and calling', recommendedPlatform: 'YouTube Shorts / Instagram Reels', aspectRatio: '9:16', caption: 'The definitions placed on you do not have to become the identity you carry.', cta: 'Watch the full conversation at MAJESTICMuseMedia.ai', confidence: 0.35, sourceReference: 'Planning hypothesis — transcript validation required' },
];
