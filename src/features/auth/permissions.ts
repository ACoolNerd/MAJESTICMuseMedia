import type { Role } from '../../types';

export type Permission =
  | 'dashboard.view'
  | 'episodes.view'
  | 'episodes.edit'
  | 'guests.view'
  | 'guests.edit'
  | 'calendar.manage'
  | 'live.manage'
  | 'media.view'
  | 'media.edit'
  | 'review.manage'
  | 'capcut.manage'
  | 'distribution.manage'
  | 'youtube.manage'
  | 'community.manage'
  | 'leads.manage'
  | 'analytics.view'
  | 'rights.manage'
  | 'tasks.manage'
  | 'approvals.manage'
  | 'ai.use'
  | 'settings.manage'
  | 'users.manage'
  | 'integrations.manage'
  | 'editorial.final';

export const roleLabels: Record<Role, string> = {
  ceo: 'CEO / Executive Producer',
  coo: 'COO / Technology & AI Operations',
  post: 'Head of Post-Production',
  social: 'Social & Distribution Manager',
  crew: 'Production Crew',
  guest: 'Guest',
  partner: 'Sponsor / Partner Viewer',
  public: 'Public Viewer',
};

const staffRead: Permission[] = [
  'dashboard.view',
  'episodes.view',
  'guests.view',
  'media.view',
  'tasks.manage',
];

export const rolePermissions: Record<Role, readonly Permission[]> = {
  ceo: [
    ...staffRead,
    'episodes.edit',
    'guests.edit',
    'calendar.manage',
    'live.manage',
    'media.edit',
    'review.manage',
    'capcut.manage',
    'distribution.manage',
    'youtube.manage',
    'community.manage',
    'leads.manage',
    'analytics.view',
    'rights.manage',
    'approvals.manage',
    'ai.use',
    'settings.manage',
    'users.manage',
    'integrations.manage',
    'editorial.final',
  ],
  coo: [
    ...staffRead,
    'episodes.edit',
    'guests.edit',
    'calendar.manage',
    'live.manage',
    'media.edit',
    'review.manage',
    'capcut.manage',
    'distribution.manage',
    'youtube.manage',
    'community.manage',
    'leads.manage',
    'analytics.view',
    'rights.manage',
    'approvals.manage',
    'ai.use',
    'settings.manage',
    'users.manage',
    'integrations.manage',
  ],
  post: [
    ...staffRead,
    'episodes.edit',
    'media.edit',
    'review.manage',
    'capcut.manage',
    'rights.manage',
    'approvals.manage',
    'analytics.view',
    'ai.use',
  ],
  social: [
    ...staffRead,
    'episodes.edit',
    'guests.edit',
    'calendar.manage',
    'live.manage',
    'distribution.manage',
    'youtube.manage',
    'community.manage',
    'leads.manage',
    'analytics.view',
    'approvals.manage',
    'ai.use',
  ],
  crew: [...staffRead, 'media.edit'],
  guest: [],
  partner: [],
  public: [],
};

export const routePermissions: Record<string, Permission> = {
  '/app': 'dashboard.view',
  '/app/executive': 'dashboard.view',
  '/app/episodes': 'episodes.view',
  '/app/calendar': 'calendar.manage',
  '/app/guests': 'guests.view',
  '/app/live': 'live.manage',
  '/app/media': 'media.view',
  '/app/review': 'review.manage',
  '/app/capcut': 'capcut.manage',
  '/app/distribution': 'distribution.manage',
  '/app/youtube': 'youtube.manage',
  '/app/community': 'community.manage',
  '/app/leads': 'leads.manage',
  '/app/analytics': 'analytics.view',
  '/app/rights': 'rights.manage',
  '/app/tasks': 'tasks.manage',
  '/app/approvals': 'approvals.manage',
  '/app/ai': 'ai.use',
  '/app/settings': 'settings.manage',
  '/app/settings/access': 'users.manage',
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role].includes(permission);
}

export function isRole(value: unknown): value is Role {
  return typeof value === 'string' && value in rolePermissions;
}
