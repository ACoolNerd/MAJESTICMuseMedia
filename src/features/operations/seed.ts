import type {
  ApprovalRecord,
  CalendarItemRecord,
  EpisodeRecord,
  GuestRecord,
  RasciWorkstreamRecord,
  ReleaseGateRecord,
  RightsRecord,
  TaskRecord,
} from './types';

const now = '2026-07-21T00:00:00.000Z';

function gates(overrides: Partial<Record<ReleaseGateRecord['name'], ReleaseGateRecord['status']>> = {}): ReleaseGateRecord[] {
  const owners: Record<ReleaseGateRecord['name'], ReleaseGateRecord['ownerRole']> = {
    Story: 'ceo', Technical: 'post', Brand: 'ceo', Rights: 'coo', Metadata: 'social',
  };
  return (['Story', 'Technical', 'Brand', 'Rights', 'Metadata'] as const).map(name => ({
    name, ownerRole: owners[name], status: overrides[name] ?? 'Pending',
  }));
}

export const seedGuests: GuestRecord[] = [
  { id: 'rebecca', name: 'Rebecca', proposedTopic: 'IDENTITY', status: 'Confirmed', bioStatus: 'Submitted', headshotStatus: 'Submitted', releaseStatus: 'Sent', sourceReference: 'Production Control Center', updatedAt: now },
  { id: 'jaeden', name: 'Jaeden', proposedTopic: 'Building Your Business as a Musician or Artist', status: 'TBD', bioStatus: 'Missing', headshotStatus: 'Missing', releaseStatus: 'Missing', sourceReference: 'Production Control Center — Proposed', updatedAt: now },
  { id: 'rosina', name: 'Rosina', proposedTopic: 'Faith and Motherhood', status: 'TBD', bioStatus: 'Missing', headshotStatus: 'Missing', releaseStatus: 'Missing', sourceReference: 'Production Control Center — Proposed', updatedAt: now },
  { id: 'noah', name: 'Noah', proposedTopic: 'Highs and Lows of a Worship Leader', status: 'TBD', bioStatus: 'Missing', headshotStatus: 'Missing', releaseStatus: 'Missing', sourceReference: 'Production Control Center — Proposed', updatedAt: now },
];

export const seedEpisodes: EpisodeRecord[] = [
  { id: 's01e01', code: 'S01E01', title: 'IDENTITY', guestIds: ['rebecca'], guestNames: ['Rebecca'], theme: 'Identity, faith, purpose', audiencePromise: 'Help viewers recognize identity through faith and purpose.', strategicOutcome: 'Establish the flagship editorial promise.', status: 'Scheduled', stage: 'Package', recordingDate: '2026-07-24', releaseDate: '2026-08-01', location: 'TBD — executive confirmation required', sourceReference: 'Production Control Center', completedAssets: 19, targetAssets: 34, gates: gates({ Story: 'Passed', Brand: 'Passed', Technical: 'In Review', Rights: 'Blocked' }), createdAt: now, updatedAt: now },
  { id: 's01e02', code: 'S01E02', title: 'Building Your Business as a Musician or Artist', guestIds: ['jaeden'], guestNames: ['Jaeden'], theme: 'Creative business, music, monetization', audiencePromise: 'Turn creative calling into a disciplined business.', strategicOutcome: 'Expand the entrepreneurship content lane.', status: 'Proposed', stage: 'Guest Development', recordingDate: '2026-08-06', releaseDate: '2026-08-14', sourceReference: 'Production Control Center — Proposed', completedAssets: 3, targetAssets: 34, gates: gates(), createdAt: now, updatedAt: now },
  { id: 's01e03', code: 'S01E03', title: 'Faith and Motherhood', guestIds: ['rebecca', 'rosina'], guestNames: ['Rebecca', 'Rosina'], theme: 'Faith, motherhood, family', audiencePromise: 'Support women balancing family, identity and calling.', strategicOutcome: 'Develop the family and motherhood audience lane.', status: 'Proposed', stage: 'Concept', recordingDate: '2026-08-13', releaseDate: '2026-08-21', sourceReference: 'Production Control Center — Proposed', completedAssets: 2, targetAssets: 34, gates: gates(), createdAt: now, updatedAt: now },
  { id: 's01e04', code: 'S01E04', title: 'Highs and Lows of a Worship Leader', guestIds: ['noah'], guestNames: ['Noah'], theme: 'Worship, calling, resilience', audiencePromise: 'Name the pressures and purpose behind worship leadership.', strategicOutcome: 'Build the worship and ministry content lane.', status: 'Proposed', stage: 'Concept', recordingDate: '2026-08-20', releaseDate: '2026-08-28', sourceReference: 'Production Control Center — Proposed', completedAssets: 1, targetAssets: 34, gates: gates(), createdAt: now, updatedAt: now },
];

export const seedTasks: TaskRecord[] = [
  { id: 'task-s01e01-rights', title: 'Clear Rebecca guest release and supporting rights evidence', episodeId: 's01e01', assignedRole: 'coo', status: 'Blocked', priority: 'Critical', dueDate: '2026-07-24', blocker: 'Signed release evidence not recorded.', sourceReference: 'S01E01 Rights gate', createdAt: now, updatedAt: now },
  { id: 'task-s01e01-audio', title: 'Resolve blocking audio note at 00:06:52', episodeId: 's01e01', assignedRole: 'post', status: 'In Progress', priority: 'Critical', dueDate: '2026-07-25', sourceReference: 'Review V1', createdAt: now, updatedAt: now },
  { id: 'task-s01e01-metadata', title: 'Complete title, description, chapters, links, and keyword package', episodeId: 's01e01', assignedRole: 'social', status: 'Open', priority: 'High', dueDate: '2026-07-28', sourceReference: 'Metadata release gate', createdAt: now, updatedAt: now },
  { id: 'task-studio', title: 'Confirm recurring studio address and access instructions', assignedRole: 'coo', status: 'Blocked', priority: 'High', blocker: 'Executive confirmation required.', sourceReference: 'Open decisions register', createdAt: now, updatedAt: now },
  { id: 'task-guests', title: 'Verify proposed guest statuses and request missing materials', assignedRole: 'coo', status: 'Open', priority: 'High', dueDate: '2026-07-24', sourceReference: 'Guest pipeline', createdAt: now, updatedAt: now },
];

export const seedApprovals: ApprovalRecord[] = [
  { id: 'approval-s01e01-editorial', episodeId: 's01e01', type: 'Editorial', requestedFromRole: 'ceo', requestedByRole: 'post', status: 'Pending', note: 'Review V1 story notes after audio correction.', updatedAt: now },
  { id: 'approval-s01e01-technical', episodeId: 's01e01', type: 'Technical', requestedFromRole: 'post', requestedByRole: 'coo', status: 'Changes Requested', note: 'Blocking audio note remains unresolved.', evidenceReference: 'Review V1 comment-2', updatedAt: now },
  { id: 'approval-s01e01-rights', episodeId: 's01e01', type: 'Rights', requestedFromRole: 'coo', requestedByRole: 'coo', status: 'Pending', note: 'Guest release evidence required.', updatedAt: now },
  { id: 'approval-s01e01-release', episodeId: 's01e01', type: 'Release', requestedFromRole: 'ceo', requestedByRole: 'social', status: 'Pending', note: 'Cannot approve until all five gates pass.', updatedAt: now },
];

export const seedRights: RightsRecord[] = [
  { id: 'rights-s01e01', episodeId: 's01e01', guestRelease: 'Pending', musicRights: 'Not Applicable', imageRights: 'Pending', disclosureStatus: 'Not Applicable', sensitiveInformationReview: 'Pending', evidenceReferences: [], updatedAt: now },
  { id: 'rights-s01e02', episodeId: 's01e02', guestRelease: 'Missing', musicRights: 'Not Applicable', imageRights: 'Missing', disclosureStatus: 'Not Applicable', sensitiveInformationReview: 'Pending', evidenceReferences: [], updatedAt: now },
  { id: 'rights-s01e03', episodeId: 's01e03', guestRelease: 'Missing', musicRights: 'Not Applicable', imageRights: 'Missing', disclosureStatus: 'Not Applicable', sensitiveInformationReview: 'Pending', evidenceReferences: [], updatedAt: now },
  { id: 'rights-s01e04', episodeId: 's01e04', guestRelease: 'Missing', musicRights: 'Pending', imageRights: 'Missing', disclosureStatus: 'Not Applicable', sensitiveInformationReview: 'Pending', evidenceReferences: [], updatedAt: now },
];

export const seedCalendarItems: CalendarItemRecord[] = [
  { id: 'cal-s01e01-record', episodeId: 's01e01', title: 'S01E01 — IDENTITY recording', type: 'Recording', startAt: '2026-07-24T18:00:00-04:00', endAt: '2026-07-24T20:00:00-04:00', status: 'Confirmed', ownerRole: 'coo', location: 'TBD — executive confirmation required', sourceReference: 'Production Control Center', updatedAt: now },
  { id: 'cal-s01e01-release', episodeId: 's01e01', title: 'S01E01 — IDENTITY release', type: 'Release', startAt: '2026-08-01T19:00:00-04:00', status: 'Scheduled', ownerRole: 'social', sourceReference: 'Production Control Center', updatedAt: now },
  { id: 'cal-s01e02-record', episodeId: 's01e02', title: 'S01E02 proposed recording', type: 'Recording', startAt: '2026-08-06T18:00:00-04:00', status: 'Proposed', ownerRole: 'coo', sourceReference: 'Production Control Center — Proposed', updatedAt: now },
  { id: 'cal-s01e03-record', episodeId: 's01e03', title: 'S01E03 proposed recording', type: 'Recording', startAt: '2026-08-13T18:00:00-04:00', status: 'Proposed', ownerRole: 'coo', sourceReference: 'Production Control Center — Proposed', updatedAt: now },
  { id: 'cal-s01e04-record', episodeId: 's01e04', title: 'S01E04 proposed recording', type: 'Recording', startAt: '2026-08-20T18:00:00-04:00', status: 'Proposed', ownerRole: 'coo', sourceReference: 'Production Control Center — Proposed', updatedAt: now },
];

const rasci = (id: string, workstream: string, ceo: RasciWorkstreamRecord['assignments']['ceo'], coo: RasciWorkstreamRecord['assignments']['coo'], post: RasciWorkstreamRecord['assignments']['post'], social: RasciWorkstreamRecord['assignments']['social'], crew: RasciWorkstreamRecord['assignments']['crew']): RasciWorkstreamRecord => ({
  id, workstream, assignments: { ceo, coo, post, social, crew }, sourceReference: 'Master Operating System RASCI', updatedAt: now,
});

export const seedRasci: RasciWorkstreamRecord[] = [
  rasci('brand', 'Brand strategy', 'A', 'R', 'C', 'C', 'I'),
  rasci('slate', 'Season and episode slate', 'A', 'R', 'C', 'C', 'I'),
  rasci('guest-research', 'Guest research', 'A', 'R', 'I', 'S', 'I'),
  rasci('guest-approval', 'Guest approval', 'A', 'C', 'I', 'I', 'I'),
  rasci('booking', 'Booking and calendar', 'C', 'A', 'I', 'S', 'I'),
  rasci('guest-rights', 'Guest materials and rights', 'A', 'R', 'S', 'S', 'C'),
  rasci('brief', 'Interview brief', 'A', 'R', 'C', 'I', 'C'),
  rasci('logistics', 'Call sheet and logistics', 'C', 'A', 'I', 'I', 'S'),
  rasci('setup', 'Production setup', 'I', 'A', 'C', 'I', 'R'),
  rasci('hosting', 'Hosting', 'A', 'S', 'I', 'I', 'S'),
  rasci('capture', 'Media capture', 'A', 'S', 'I', 'S', 'R'),
  rasci('ingest', 'Media ingest and backup', 'I', 'A', 'R', 'I', 'S'),
  rasci('full-edit', 'Full episode edit', 'C', 'I', 'A', 'I', 'I'),
  rasci('cutdowns', 'CapCut cutdowns', 'C', 'S', 'A', 'S', 'I'),
  rasci('editorial', 'Editorial approval', 'A', 'S', 'C', 'I', 'I'),
  rasci('metadata', 'SEO and metadata', 'A', 'R', 'C', 'S', 'I'),
  rasci('publishing', 'Publishing', 'A', 'S', 'C', 'R', 'I'),
  rasci('guest-promo', 'Guest promotion', 'C', 'S', 'I', 'A', 'I'),
  rasci('moderation', 'Community moderation', 'I', 'C', 'I', 'A', 'I'),
  rasci('analytics', 'Analytics', 'A', 'R', 'C', 'S', 'I'),
  rasci('partnerships', 'Sponsors and partnerships', 'A', 'R', 'C', 'S', 'I'),
  rasci('archive', 'Rights and archive proof', 'A', 'R', 'S', 'I', 'C'),
];
