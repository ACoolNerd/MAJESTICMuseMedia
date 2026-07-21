export type SourceStatus = 'Confirmed' | 'Planned' | 'Proposed' | 'TBD' | 'System Evidence';

export interface SourceRecord {
  id: string;
  title: string;
  priority: number;
  type: 'Control Center' | 'Operating Source' | 'Workbook' | 'Walkthrough' | 'Approved Media' | 'Transcript' | 'Guest Material' | 'Archive' | 'System Record';
  status: SourceStatus;
  updatedAt: string;
  location?: string;
  summary: string;
}

export interface MuseCitation {
  sourceId: string;
  sourceTitle: string;
  recordId?: string;
  status: SourceStatus;
  observedAt: string;
}

export interface MuseAnswer {
  id: string;
  question: string;
  answer: string;
  facts: string[];
  recommendations: string[];
  missingInformation: string[];
  confidence: number;
  citations: MuseCitation[];
  generatedAt: string;
  mode: 'Deterministic local' | 'Gemini structured output';
  requiresApproval: boolean;
}

export interface AnalyticsSnapshot {
  id: string;
  episodeId: string;
  source: 'YouTube' | 'Twitch' | 'KICK' | 'Website' | 'Manual';
  period: '24h' | '72h' | '7d' | '28d';
  capturedAt: string;
  coverageThrough: string;
  metrics: Record<string, number>;
  notes?: string;
}

export type LeadType = 'Guest' | 'Sponsor' | 'Partner' | 'Media Client' | 'Community Collaborator' | 'Speaker Inquiry' | 'Press' | 'Volunteer' | 'Vendor' | 'Newsletter Subscriber';
export type LeadStatus = 'New' | 'Reviewing' | 'Qualified' | 'Contacted' | 'Meeting Scheduled' | 'Proposal' | 'Active' | 'Won' | 'Nurture' | 'Not a Fit' | 'Closed';

export interface LeadRecord {
  id: string;
  name: string;
  email?: string;
  organization?: string;
  leadType: LeadType;
  status: LeadStatus;
  source: string;
  campaign?: string;
  episodeId?: string;
  assignedRole: 'ceo' | 'coo' | 'social';
  consent: boolean;
  score: number;
  nextAction?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RepurposingMoment {
  id: string;
  episodeId: string;
  startSeconds: number;
  endSeconds: number;
  speaker: string;
  hook: string;
  topic: string;
  emotionalTone: string;
  audience: string;
  recommendedPlatform: string;
  aspectRatio: '16:9' | '9:16' | '4:5' | '1:1';
  caption: string;
  cta: string;
  sensitivityFlag?: string;
  confidence: number;
  sourceReference: string;
}
