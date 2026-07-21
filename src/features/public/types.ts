export type PublicContentStatus = 'Upcoming' | 'Live' | 'Published' | 'Archived';

export interface PublicEpisodeRecord {
  id: string;
  code: string;
  slug: string;
  title: string;
  summary: string;
  theme: string;
  status: PublicContentStatus;
  releaseAt?: string;
  guestIds: string[];
  guestNames: string[];
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  transcriptStatus: 'Not Available' | 'Pending Approval' | 'Available';
  chapters: Array<{ time: string; title: string }>;
  resources: Array<{ label: string; url: string }>;
  ctaLabel: string;
  ctaUrl: string;
  sourceReference: string;
  updatedAt: string;
}

export interface PublicGuestRecord {
  id: string;
  slug: string;
  name: string;
  approvedTitle?: string;
  approvedBio?: string;
  imageUrl?: string;
  websiteUrl?: string;
  socialLinks: Array<{ label: string; url: string }>;
  episodeIds: string[];
  sourceReference: string;
  updatedAt: string;
}

export interface PublicClipRecord {
  id: string;
  slug: string;
  episodeId: string;
  title: string;
  summary: string;
  platform: string;
  durationSeconds?: number;
  aspectRatio: '16:9' | '9:16' | '4:5' | '1:1';
  mediaUrl?: string;
  thumbnailUrl?: string;
  status: 'Pending Approval' | 'Published';
  updatedAt: string;
}

export interface PublicArticleRecord {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body?: string;
  episodeId?: string;
  status: 'Draft' | 'Published';
  publishedAt?: string;
  updatedAt: string;
}

export interface PublicLiveRecord {
  id: string;
  title: string;
  status: 'No Event' | 'Upcoming' | 'Live' | 'Replay';
  startsAt?: string;
  endsAt?: string;
  description: string;
  platformLinks: Array<{ platform: 'YouTube' | 'Twitch' | 'KICK'; url: string }>;
  replayUrl?: string;
  updatedAt: string;
}
