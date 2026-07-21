import { ArrowRight, Mic2, Play, Radio, Sparkles, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PublicHeader } from '../components/Shell';

const features: Array<{ icon: LucideIcon; title: string; copy: string }> = [
  { icon: Mic2, title: 'Cinematic conversations', copy: 'Identity, faith, purpose, family, leadership, creativity, legacy, and calling.' },
  { icon: Radio, title: 'Live across platforms', copy: 'One control plane for YouTube, Twitch, KICK, chat, moderation, and replay workflows.' },
  { icon: Sparkles, title: 'Every story becomes a system', copy: 'Episodes become clips, images, articles, newsletters, community prompts, and measurable journeys.' },
];

export default function Home() {
  return <div className="bg-[#F8F4EC]">
    <section className="muse-gradient relative min-h-[92vh] overflow-hidden text-[#F8F4EC]">
      <PublicHeader />
      <div className="mx-auto flex min-h-[92vh] max-w-7xl items-center px-5 pb-16 pt-28 md:px-10">
        <div className="max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm"><Sparkles size={16} className="text-[#C9A227]"/> MAJESTIC Muse Podcast by Marchette</div>
          <h1 className="font-serif text-5xl leading-[1.02] md:text-7xl lg:text-8xl">Where faith, purpose, and identity <span className="text-[#D8A7B1]">find their voice.</span></h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#F8F4EC]/75">Transformational conversations, creative leadership, and stories that help people recognize who they are and what they are called to build.</p>
          <div className="mt-9 flex flex-wrap gap-4"><Link to="/episodes" className="inline-flex items-center gap-2 rounded-full bg-[#C9A227] px-6 py-3 font-semibold text-[#1B1734]"><Play size={18} fill="currentColor"/> Watch the latest episode</Link><Link to="/community" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3">Join the community <ArrowRight size={18}/></Link></div>
        </div>
      </div>
    </section>
    <section className="mx-auto grid max-w-7xl gap-5 px-5 py-20 md:grid-cols-3 md:px-10">{features.map(({ icon: Icon, title, copy }) => <article key={title} className="rounded-3xl border border-[#1B1734]/10 bg-white p-7 shadow-sm"><Icon className="text-[#8B2C6F]"/><h2 className="mt-5 font-serif text-2xl">{title}</h2><p className="mt-3 leading-7 text-[#1B1734]/65">{copy}</p></article>)}</section>
  </div>;
}
