export type Status = 'Confirmed' | 'Planned' | 'Proposed' | 'TBD' | 'Blocked' | 'In Progress' | 'In Review' | 'Approved' | 'Scheduled' | 'Published' | 'Archived';
export type Role = 'ceo' | 'coo' | 'post' | 'social' | 'crew' | 'guest' | 'partner' | 'public';
export type GateStatus = 'Pending' | 'In Review' | 'Passed' | 'Blocked' | 'Waived with Written Reason';
export type EpisodeStage = 'Concept' | 'Guest Development' | 'Pre-Production' | 'Production Capture' | 'Create / Ingest' | 'Cut' | 'Package' | 'Release' | 'Amplify' | 'Learn';

export interface Episode {
  id: string;
  code: string;
  title: string;
  guests: string[];
  recordingDate?: string;
  releaseDate?: string;
  status: Status;
  stage: EpisodeStage;
  theme: string;
  completedAssets: number;
  targetAssets: number;
}

export interface PlatformConnection {
  name: 'YouTube' | 'Twitch' | 'KICK' | 'Google Drive' | 'Google Calendar' | 'CapCut';
  status: 'Connected' | 'Connection Required' | 'Degraded';
  capabilities: string[];
}
