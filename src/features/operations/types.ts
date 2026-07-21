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
  dueDate?: string;
  blocker?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalRecord {
  id: string;
  episodeId: string;
  type: 'Editorial' | 'Technical' | 'Brand' | 'Rights' | 'Metadata' | 'Release';
  requestedFromRole: Role;
  status: 'Pending' | 'Approved' | 'Changes Requested' | 'Waived with Written Reason';
  note?: string;
  updatedAt: string;
}

export interface RightsRecord {
  id: string;
  episodeId: string;
  guestRelease: 'Missing' | 'Pending' | 'Cleared';
  musicRights: 'Not Applicable' | 'Missing' | 'Pending' | 'Cleared';
  imageRights: 'Not Applicable' | 'Missing' | 'Pending' | 'Cleared';
  disclosureStatus: 'Not Applicable' | 'Missing' | 'Cleared';
  updatedAt: string;
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
