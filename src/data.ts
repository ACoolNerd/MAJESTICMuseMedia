import type { Episode, PlatformConnection } from './types';

export const episodes: Episode[] = [
  { id: '1', code: 'S01E01', title: 'IDENTITY', guests: ['Rebecca'], recordingDate: '2026-07-24', releaseDate: '2026-08-01', status: 'Scheduled', stage: 'Package', theme: 'Identity, faith, purpose', completedAssets: 19, targetAssets: 34 },
  { id: '2', code: 'S01E02', title: 'Building Your Business as a Musician or Artist', guests: ['Jaeden'], recordingDate: '2026-08-06', releaseDate: '2026-08-14', status: 'Proposed', stage: 'Guest Development', theme: 'Creative business, music, monetization', completedAssets: 3, targetAssets: 34 },
  { id: '3', code: 'S01E03', title: 'Faith and Motherhood', guests: ['Rebecca', 'Rosina'], recordingDate: '2026-08-13', releaseDate: '2026-08-21', status: 'Proposed', stage: 'Concept', theme: 'Faith, motherhood, family', completedAssets: 2, targetAssets: 34 },
  { id: '4', code: 'S01E04', title: 'Highs and Lows of a Worship Leader', guests: ['Noah'], recordingDate: '2026-08-20', releaseDate: '2026-08-28', status: 'Proposed', stage: 'Concept', theme: 'Worship, calling, resilience', completedAssets: 1, targetAssets: 34 },
];

export const connections: PlatformConnection[] = [
  { name: 'YouTube', status: 'Connection Required', capabilities: ['Upload', 'Live events', 'Comments', 'Analytics'] },
  { name: 'Twitch', status: 'Connection Required', capabilities: ['Schedule', 'EventSub', 'Chat'] },
  { name: 'KICK', status: 'Connection Required', capabilities: ['OAuth', 'Channel data', 'Chat where supported'] },
  { name: 'Google Drive', status: 'Connection Required', capabilities: ['Source registry', 'Media links', 'Guest packets'] },
  { name: 'Google Calendar', status: 'Connection Required', capabilities: ['Production calendar', 'Guest scheduling'] },
  { name: 'CapCut', status: 'Connection Required', capabilities: ['Edit packet handoff', 'Review export return'] },
];

export const navModules = [
  ['Executive', '/app/executive'], ['Episodes', '/app/episodes'], ['Calendar', '/app/calendar'], ['Guests', '/app/guests'], ['Live', '/app/live'], ['Media', '/app/media'], ['Review', '/app/review'], ['CapCut', '/app/capcut'], ['Distribution', '/app/distribution'], ['YouTube', '/app/youtube'], ['Repurposing', '/app/repurposing'], ['Community', '/app/community'], ['Leads', '/app/leads'], ['Analytics', '/app/analytics'], ['Rights', '/app/rights'], ['Tasks', '/app/tasks'], ['Approvals', '/app/approvals'], ['Muse Intelligence', '/app/ai'], ['Settings', '/app/settings'],
] as const;
