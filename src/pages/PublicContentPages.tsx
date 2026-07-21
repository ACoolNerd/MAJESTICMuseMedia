import { Accessibility, AlertTriangle, BookOpen, HeartHandshake, Newspaper, Sparkles, Video } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { PublicPageShell } from '../components/PublicPageShell';
import { SEO } from '../components/SEO';
import { usePublicContent } from '../features/public/PublicContentContext';

export function ClipsPage() {
  const { clips } = usePublicContent();
  return <PublicPageShell><SEO title="Clips" description="Watch approved short-form moments from MAJESTIC Muse Podcast by Marchette." canonicalPath="/clips"/><Hero eyebrow="Short-Form Library" title="Moments made to travel." copy="Every approved clip should lead back to a complete episode, article, community action, or inquiry on MAJESTICMuseMedia.ai."/><section className="mx-auto max-w-7xl px-5 py-14 md:px-10">{clips.length ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{clips.map(clip => <article key={clip.id} className="rounded-[2rem] bg-white p-6 ring-1 ring-[#1B1734]/5"><Video className="text-[#8B2C6F]"/><h2 className="mt-4 font-serif text-2xl">{clip.title}</h2><p className="mt-3 text-sm leading-6 text-[#1B1734]/60">{clip.summary}</p><p className="mt-4 text-xs font-semibold">{clip.platform} · {clip.aspectRatio}</p></article>)}</div> : <EmptyState icon={Video} title="No clip is verified as published yet." copy="Clip candidates remain private until the transcript, edit, rights, caption, CTA, and public URL are approved."/>}</section></PublicPageShell>;
}

export function ArticlesPage() {
  const { articles } = usePublicContent();
  return <PublicPageShell><SEO title="Articles" description="Read approved essays, show notes, and episode-derived insights from MAJESTIC Muse." canonicalPath="/articles"/><Hero eyebrow="Articles and Show Notes" title="Ideas that continue after the conversation." copy="Approved transcripts and editorial review become essays, resources, lessons, and community questions."/><section className="mx-auto max-w-7xl px-5 py-14 md:px-10">{articles.length ? <div className="grid gap-5 md:grid-cols-2">{articles.map(article => <article key={article.id} className="rounded-[2rem] bg-white p-7 ring-1 ring-[#1B1734]/5"><Newspaper className="text-[#8B2C6F]"/><h2 className="mt-4 font-serif text-3xl">{article.title}</h2><p className="mt-3 leading-7 text-[#1B1734]/60">{article.excerpt}</p></article>)}</div> : <EmptyState icon={Newspaper} title="No article is verified as published yet." copy="Drafts and AI-generated summaries remain private until source, quote, rights, and editorial review are complete."/>}</section></PublicPageShell>;
}

export function CommunityPage() {
  return <PublicPageShell><SEO title="Community" description="Join a thoughtful MAJESTIC Muse community centered on faith, purpose, identity, creativity, family, and legacy." canonicalPath="/community"/><Hero eyebrow="MAJESTIC Muse Community" title="Your story can help someone else find their voice." copy="Share a story, suggest a guest, respond to a conversation, or join the newsletter. Public contributions require consent and review."/><section className="mx-auto grid max-w-6xl gap-5 px-5 py-14 md:grid-cols-3 md:px-10"><Action icon={HeartHandshake} title="Share your story" copy="Submit a story privately for editorial review and choose whether it may be published." url="/submit-your-story"/><Action icon={Sparkles} title="Suggest a guest" copy="Recommend a person, topic, or testimony that aligns with the show’s purpose." url="/suggest-a-guest"/><Action icon={BookOpen} title="Join the newsletter" copy="Receive approved episodes, reflections, resources, and community invitations." url="/newsletter"/></section></PublicPageShell>;
}

export function AboutPage() {
  return <PublicPageShell><SEO title="About" description="Learn the mission and operating promise of MAJESTIC Muse Podcast by Marchette." canonicalPath="/about"/><Hero eyebrow="About the Platform" title="A media home for faith, purpose, identity, and the courage to speak." copy="MAJESTIC Muse Podcast by Marchette creates candid, purpose-led conversations and turns each approved story into a connected ecosystem of episodes, clips, articles, community prompts, and resources."/><section className="mx-auto grid max-w-6xl gap-6 px-5 py-14 lg:grid-cols-[1.2fr_.8fr] md:px-10"><article className="rounded-[2rem] bg-white p-8 ring-1 ring-[#1B1734]/5"><h2 className="font-serif text-3xl">The editorial promise</h2><p className="mt-4 leading-8 text-[#1B1734]/65">The platform centers conversations that help people recognize who they are, understand what they are called to build, and move with greater clarity. It does not publish unapproved guest claims, fabricate biographies, or present planning assumptions as measured results.</p><h2 className="mt-8 font-serif text-3xl">Leadership</h2><p className="mt-4 leading-8 text-[#1B1734]/65">Marchette serves as Founder, Host, Executive Producer, and final editorial authority. Technology, post-production, and distribution operate through defined responsibilities and release gates.</p></article><aside className="rounded-[2rem] bg-[#1B1734] p-7 text-white"><h2 className="font-serif text-3xl">Where faith, purpose, and identity find their voice.</h2><p className="mt-4 leading-7 text-white/60">The official flagship name is MAJESTIC Muse Podcast by Marchette. Legacy labels do not replace the public brand.</p><Link to="/be-a-guest" className="mt-6 block rounded-full bg-[#C9A227] px-5 py-3 text-center font-semibold text-[#1B1734]">Explore guest interest</Link></aside></section></PublicPageShell>;
}

export function LegalPage() {
  const { pathname } = useLocation();
  const slug = pathname.split('/').filter(Boolean).at(-1) ?? 'policy';
  const pages: Record<string, { title: string; icon: typeof Accessibility; paragraphs: string[] }> = {
    privacy: { title: 'Privacy Notice — Approval Required', icon: AlertTriangle, paragraphs: ['This route is a controlled policy placeholder, not a representation that final legal language has been approved.', 'Before public launch, the approved notice must explain data collected through forms, authentication, analytics, media uploads, platform integrations, retention, deletion, export, security, service providers, and contact procedures.'] },
    terms: { title: 'Terms of Use — Approval Required', icon: AlertTriangle, paragraphs: ['Final terms must be reviewed and approved before public launch.', 'The final document should cover acceptable use, intellectual property, user submissions, platform links, disclaimers, limitation of liability, account suspension, governing terms, and contact procedures.'] },
    'community-guidelines': { title: 'Community Guidelines', icon: HeartHandshake, paragraphs: ['Engage with dignity, honesty, and respect. Do not harass, threaten, impersonate, exploit, spam, or share private information without permission.', 'Comments and submissions may be reviewed, hidden, removed, escalated, or preserved when needed for safety, rights, moderation, or legal obligations.'] },
    accessibility: { title: 'Accessibility Commitment', icon: Accessibility, paragraphs: ['MAJESTIC Muse aims to support keyboard navigation, readable contrast, labeled forms, captions, transcripts, alternative text, responsive layouts, and clear error messages.', 'An accessibility acceptance review and contact process remain required before launch.'] },
  };
  const page = pages[slug] ?? pages.privacy!;
  const Icon = page.icon;
  return <PublicPageShell><SEO title={page.title} description={`${page.title} for MAJESTICMuseMedia.ai.`} canonicalPath={pathname}/><section className="mx-auto max-w-4xl px-5 py-20 md:px-10"><Icon size={44} className="text-[#8B2C6F]"/><h1 className="mt-5 font-serif text-5xl">{page.title}</h1><div className="mt-8 space-y-5">{page.paragraphs.map(paragraph => <p key={paragraph} className="rounded-2xl bg-white p-6 leading-8 text-[#1B1734]/65 ring-1 ring-[#1B1734]/5">{paragraph}</p>)}</div></section></PublicPageShell>;
}

function Hero({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return <section className="bg-[#1B1734] px-5 py-20 text-white md:px-10"><div className="mx-auto max-w-7xl"><p className="text-xs font-bold uppercase tracking-[.25em] text-[#C9A227]">{eyebrow}</p><h1 className="mt-4 max-w-4xl font-serif text-5xl md:text-7xl">{title}</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-white/65">{copy}</p></div></section>;
}

function EmptyState({ icon: Icon, title, copy }: { icon: typeof Video; title: string; copy: string }) {
  return <div className="rounded-[2rem] bg-white p-8 ring-1 ring-[#1B1734]/5"><Icon size={40} className="text-[#8B2C6F]"/><h2 className="mt-4 font-serif text-3xl">{title}</h2><p className="mt-3 max-w-2xl leading-7 text-[#1B1734]/60">{copy}</p></div>;
}

function Action({ icon: Icon, title, copy, url }: { icon: typeof HeartHandshake; title: string; copy: string; url: string }) {
  return <article className="rounded-[2rem] bg-white p-7 ring-1 ring-[#1B1734]/5"><Icon className="text-[#8B2C6F]"/><h2 className="mt-4 font-serif text-2xl">{title}</h2><p className="mt-3 text-sm leading-6 text-[#1B1734]/60">{copy}</p><Link to={url} className="mt-5 inline-block font-semibold text-[#8B2C6F]">Continue →</Link></article>;
}
