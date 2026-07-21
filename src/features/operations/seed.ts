import type { EpisodeRecord, GuestRecord, ReleaseGateRecord } from './types';

const now = '2026-07-21T00:00:00.000Z';

function gates(overrides: Partial<Record<ReleaseGateRecord['name'], ReleaseGateRecord['status']>> = {}): ReleaseGateRecord[] {
  const owners: Record<ReleaseGateRecord['name'], ReleaseGateRecord['ownerRole']> = {
    Story: 'ceo',
    Technical: 'post',
    Brand: 'ceo',
    Rights: 'coo',
    Metadata: 'social',
  };
  return (['Story', 'Technical', 'Brand', 'Rights', 'Metadata'] as const).map(name => ({
    name,
    ownerRole: owners[name],
    status: overrides[name] ?? 'Pending',
  }));
}

export const seedGuests: GuestRecord[] = [
  { id: 'rebecca', name: 'Rebecca', proposedTopic: 'IDENTITY', status: 'Confirmed', bioStatus: 'Submitted', headshotStatus: 'Submitted', releaseStatus: 'Sent', sourceReference: 'Production Control Center', updatedAt: now },
  { id: 'jaeden', name: 'Jaeden', proposedTopic: 'Building Your Business as a Musician or Artist', status: 'TBD', bioStatus: 'Missing', headshotStatus: 'Missing', releaseStatus: 'Missing', sourceReference: 'Production Control Center — Proposed', updatedAt: now },
  { id: 'rosina', name: 'Rosina', proposedTopic: 'Faith and Motherhood', status: 'TBD', bioStatus: 'Missing', headshotStatus: 'Missing', releaseStatus: 'Missing', sourceReference: 'Production Control Center — Proposed', updatedAt: now },
  { id: 'noah', name: 'Noah', proposedTopic: 'Highs and Lows of a Worship Leader', status: 'TBD', bioStatus: 'Missing', headshotStatus: 'Missing', releaseStatus: 'Missing', sourceReference: 'Production Control Center — Proposed', updatedAt: now },
];

export const seedEpisodes: EpisodeRecord[] = [
  {
    id: 's01e01', code: 'S01E01', title: 'IDENTITY', guestIds: ['rebecca'], guestNames: ['Rebecca'],
    theme: 'Identity, faith, purpose', audiencePromise: 'Help viewers recognize identity through faith and purpose.',
    strategicOutcome: 'Establish the flagship editorial promise.', status: 'Scheduled', stage: 'Package',
    recordingDate: '2026-07-24', releaseDate: '2026-08-01', location: 'TBD — executive confirmation required',
    sourceReference: 'Production Control Center', completedAssets: 19, targetAssets: 34,
    gates: gates({ Story: 'Passed', Brand: 'Passed', Technical: 'In Review', Rights: 'Blocked' }), createdAt: now, updatedAt: now,
  },
  {
    id: 's01e02', code: 'S01E02', title: 'Building Your Business as a Musician or Artist', guestIds: ['jaeden'], guestNames: ['Jaeden'],
    theme: 'Creative business, music, monetization', audiencePromise: 'Turn creative calling into a disciplined business.',
    strategicOutcome: 'Expand the entrepreneurship content lane.', status: 'Proposed', stage: 'Guest Development',
    recordingDate: '2026-08-06', releaseDate: '2026-08-14', sourceReference: 'Production Control Center — Proposed',
    completedAssets: 3, targetAssets: 34, gates: gates(), createdAt: now, updatedAt: now,
  },
  {
    id: 's01e03', code: 'S01E03', title: 'Faith and Motherhood', guestIds: ['rebecca', 'rosina'], guestNames: ['Rebecca', 'Rosina'],
    theme: 'Faith, motherhood, family', audiencePromise: 'Support women balancing family, identity and calling.',
    strategicOutcome: 'Develop the family and motherhood audience lane.', status: 'Proposed', stage: 'Concept',
    recordingDate: '2026-08-13', releaseDate: '2026-08-21', sourceReference: 'Production Control Center — Proposed',
    completedAssets: 2, targetAssets: 34, gates: gates(), createdAt: now, updatedAt: now,
  },
  {
    id: 's01e04', code: 'S01E04', title: 'Highs and Lows of a Worship Leader', guestIds: ['noah'], guestNames: ['Noah'],
    theme: 'Worship, calling, resilience', audiencePromise: 'Name the pressures and purpose behind worship leadership.',
    strategicOutcome: 'Build the worship and ministry content lane.', status: 'Proposed', stage: 'Concept',
    recordingDate: '2026-08-20', releaseDate: '2026-08-28', sourceReference: 'Production Control Center — Proposed',
    completedAssets: 1, targetAssets: 34, gates: gates(), createdAt: now, updatedAt: now,
  },
];
