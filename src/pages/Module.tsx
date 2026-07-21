import { Cable, CheckSquare2, Construction, Sparkles, type LucideIcon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { AppShell } from '../components/Shell';

const copy: Record<string, string> = {
  episodes: 'Manage the ten-stage episode lifecycle, asset matrix, release gates, and source-grounded status.',
  guests: 'Qualify guests, collect biographies and headshots, manage releases, and deliver promotional kits.',
  live: 'Schedule YouTube, Twitch, and KICK events while respecting each platform adapter’s capabilities.',
  media: 'Track originals, proxies, checksums, backups, masters, captions, images, and derivatives.',
  review: 'Centralize versioned, time-coded feedback and convert approved notes into a revision list.',
  capcut: 'Generate edit briefs, transcripts, SRT files, clip CSVs, crop plans, and final-export return steps.',
  youtube: 'Develop keyword clusters, titles, thumbnail tests, descriptions, chapters, uploads, and performance learning.',
  community: 'Triage comments, testimony, questions, corrections, leads, safety concerns, and response approvals.',
  leads: 'Route guest, sponsor, partner, media-service, press, and community opportunities with attribution.',
  ai: 'Ask Muse Intelligence what is true, what is blocked, what is missing, and what action should happen next.',
};

const cards: Array<{ icon: LucideIcon; title: string; copy: string }> = [
  { icon: CheckSquare2, title: 'Workflow ready', copy: 'Statuses, ownership, approvals, and audit events are part of the shared domain model.' },
  { icon: Cable, title: 'Adapter boundary', copy: 'External services remain disconnected until OAuth and server-side secrets are configured.' },
  { icon: Sparkles, title: 'Muse-assisted', copy: 'AI recommendations stay reviewable and never publish or send automatically.' },
];

export default function Module() {
  const location = useLocation();
  const slug = location.pathname.split('/').filter(Boolean).at(-1) ?? 'workspace';
  const title = slug.replaceAll('-', ' ').replace(/\b\w/g, character => character.toUpperCase());
  return <AppShell><div className="mx-auto max-w-6xl"><span className="inline-flex items-center gap-2 rounded-full bg-[#8B2C6F]/10 px-3 py-1 text-xs font-semibold text-[#8B2C6F]"><Construction size={14}/> Foundation module</span><h1 className="mt-4 font-serif text-4xl">{title}</h1><p className="mt-3 max-w-3xl text-lg leading-8 text-[#1B1734]/60">{copy[slug] ?? 'This operating workspace is scaffolded and ready for the next implementation phase.'}</p><div className="mt-8 grid gap-5 md:grid-cols-3">{cards.map(({ icon: Icon, title: cardTitle, copy: cardCopy }) => <article key={cardTitle} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#1B1734]/5"><Icon className="text-[#8B2C6F]"/><h2 className="mt-4 font-serif text-xl">{cardTitle}</h2><p className="mt-2 text-sm leading-6 text-[#1B1734]/55">{cardCopy}</p></article>)}</div></div></AppShell>;
}
