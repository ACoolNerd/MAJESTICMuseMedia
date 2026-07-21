import type { EpisodeStage, GateStatus, Role, Status } from '../../types';

export interface ReleaseGateRecord {
  name: 'Story' | 'Technical' | 'Brand' | 'Rights' | 'Metadata';
  status: GateStatus;
  ownerRole: Role;
  reason?: string;
  updatedAt?: string;
}

export interface EpisodeRecord {
  id: string;
  code: string;
  title: string;
  guestIds: string[];
  guestNames: string[];
  theme: string;
  audiencePromise: string;
  strategicOutcome: string;
  status: Status;
  stage: EpisodeStage;
  recordingDate?: string;
  releaseDate?: string;
  location?: string;
  sourceReference: string;
  completedAssets: number;
  targetAssets: number;
  gates: ReleaseGateRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface GuestRecord {
  id: string;
  name: string;
  email?: string;
  organization?: string;
  proposedTopic: string;
  status: 'Suggested' | 'Researching' | 'Invited' | 'Confirmed' | 'Recorded' | 'Published' | 'Declined' | 'TBD';
  bioStatus: 'Missing' | 'Submitted' | 'Approved';
  headshotStatus: 'Missing' | 'Submitted' | 'Approved';
  releaseStatus: 'Missing' | 'Sent' | 'Signed' | 'Waived with Written Reason';
  ownerUid?: string;
  sourceReference: string;
  updatedAt: string;
}

export interface TaskRecord {
  id: string;
  title: string;
  episodeId?: string;
  assignedRole: Role;
  status: 'Open' | 'In Progress' | 'Blocked' | 'Done';
  priority: 'Low' | 'Normal' | 'High' | 'Critical';
  dueDate?: string;
  blocker?: string;
  sourceReference: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalRecord {
  id: string;
  episodeId: string;
  type: 'Editorial' | 'Technical' | 'Brand' | 'Rights' | 'Metadata' | 'Release';
  requestedFromRole: Role;
  requestedByRole: Role;
  status: 'Pending' | 'Approved' | 'Changes Requested' | 'Waived with Written Reason';
  note?: string;
  evidenceReference?: string;
  updatedAt: string;
}

export interface RightsRecord {
  id: string;
  episodeId: string;
  guestRelease: 'Missing' | 'Pending' | 'Cleared';
  musicRights: 'Not Applicable' | 'Missing' | 'Pending' | 'Cleared';
  imageRights: 'Not Applicable' | 'Missing' | 'Pending' | 'Cleared';
  disclosureStatus: 'Not Applicable' | 'Missing' | 'Cleared';
  sensitiveInformationReview: 'Pending' | 'Cleared' | 'Blocked';
  evidenceReferences: string[];
  updatedAt: string;
}

export interface CalendarItemRecord {
  id: string;
  episodeId?: string;
  title: string;
  type: 'Recording' | 'Release' | 'Livestream' | 'Deadline' | 'Meeting' | 'Promotion';
  startAt: string;
  endAt?: string;
  status: Status;
  ownerRole: Role;
  location?: string;
  sourceReference: string;
  updatedAt: string;
}

export type RasciCode = 'R' | 'A' | 'S' | 'C' | 'I' | '';
export type RasciRole = 'ceo' | 'coo' | 'post' | 'social' | 'crew';

export interface RasciWorkstreamRecord {
  id: string;
  workstream: string;
  assignments: Record<RasciRole, RasciCode>;
  sourceReference: string;
  updatedAt: string;
  updatedByRole?: Role;
  changeReason?: string;
}

export type FormType = 'guest-interest' | 'guest-preparation' | 'community-story' | 'guest-suggestion' | 'sponsor-inquiry' | 'media-services' | 'newsletter' | 'viewer-feedback';

export interface FormSubmissionRecord {
  id: string;
  formType: FormType;
  submittedAt: string;
  consent: boolean;
  status: 'New' | 'Reviewing' | 'Qualified' | 'Closed';
  source: string;
  payload: Record<string, string | boolean | string[]>;
}
