import { useState, type FormEvent } from 'react';
import { AlertTriangle, BookOpen, CheckCircle2, Sparkles } from 'lucide-react';
import { AppShell } from '../components/Shell';
import { askMuse } from '../features/intelligence/engine';
import type { MuseAnswer } from '../features/intelligence/types';
import { useMedia } from '../features/media/MediaContext';
import { useOperations } from '../features/operations/OperationsContext';
import { usePlatforms } from '../features/platforms/PlatformContext';

const starterQuestions = [
  'What needs Marchette’s approval today?',
  'Which guest materials are missing?',
  'What is blocking the next release?',
  'Where is the latest final master?',
  'What is the platform connection status?',
  'Which distribution jobs are unfinished?',
];

export default function MuseIntelligence() {
  const { episodes, guests } = useOperations();
  const { assets, comments } = useMedia();
  const { connections, jobs } = usePlatforms();
  const [question, setQuestion] = useState(starterQuestions[0]);
  const [answer, setAnswer] = useState<MuseAnswer | null>(null);

  function run(input: string) {
    setQuestion(input);
    setAnswer(askMuse(input, { episodes, guests, assets, comments, connections, jobs }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    run(question);
  }

  return <AppShell>
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><span className="inline-flex items-center gap-2 rounded-full bg-[#8B2C6F]/10 px-3 py-1 text-xs font-bold text-[#8B2C6F]"><Sparkles size={14}/>Muse Intelligence</span><h1 className="mt-4 font-serif text-4xl">Ask what is true, blocked or next.</h1><p className="mt-2 max-w-3xl text-[#1B1734]/60">Every operational answer shows sources, confidence, missing information and reviewable recommendations.</p></div><span className="rounded-full bg-white px-4 py-2 text-xs shadow-sm ring-1 ring-[#1B1734]/8">Deterministic local mode</span></div>

    <div className="mt-7 grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
      <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[#1B1734]/5">
        <h2 className="font-serif text-2xl">Starter questions</h2><div className="mt-4 space-y-2">{starterQuestions.map(item => <button key={item} onClick={() => run(item)} className="w-full rounded-2xl border border-[#1B1734]/8 px-4 py-3 text-left text-sm hover:border-[#8B2C6F]">{item}</button>)}</div>
        <form onSubmit={submit} className="mt-6 border-t border-[#1B1734]/10 pt-6"><label className="text-sm font-semibold">Ask Muse<textarea value={question} onChange={event => setQuestion(event.target.value)} rows={4} className="mt-2 w-full rounded-2xl border border-[#1B1734]/15 p-4 outline-none focus:border-[#8B2C6F]"/></label><button className="mt-3 w-full rounded-full bg-[#1B1734] px-5 py-3 font-semibold text-white">Generate grounded answer</button></form>
      </section>

      <section className="rounded-[2rem] bg-[#1B1734] p-6 text-white shadow-xl">
        {!answer ? <div className="flex min-h-[480px] flex-col items-center justify-center text-center"><Sparkles className="text-[#C9A227]" size={52}/><h2 className="mt-5 font-serif text-3xl">Muse is ready.</h2><p className="mt-3 max-w-md text-white/60">Choose a question to inspect the loaded operating records without inventing completion.</p></div> : <div>
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start"><div><p className="text-xs font-bold uppercase tracking-widest text-[#D8A7B1]">Question</p><h2 className="mt-2 font-serif text-3xl">{answer.question}</h2></div><span className="rounded-full bg-white/10 px-3 py-1 text-xs">Confidence {Math.round(answer.confidence * 100)}%</span></div>
          <p className="mt-6 text-lg leading-8 text-white/85">{answer.answer}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2"><AnswerList title="Facts" values={answer.facts} empty="No supporting facts returned."/><AnswerList title="Recommendations" values={answer.recommendations} empty="No recommendation generated."/></div>
          {answer.missingInformation.length > 0 && <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4"><h3 className="flex items-center gap-2 font-semibold text-amber-100"><AlertTriangle size={17}/>Missing information</h3><ul className="mt-3 space-y-2 text-sm text-amber-50/70">{answer.missingInformation.map(item => <li key={item}>• {item}</li>)}</ul></div>}
          <div className="mt-5 rounded-2xl border border-white/10 p-4"><h3 className="flex items-center gap-2 font-semibold"><BookOpen size={17}/>Sources</h3><div className="mt-3 space-y-3">{answer.citations.map(item => <div key={`${item.sourceId}-${item.recordId ?? ''}`} className="rounded-xl bg-white/5 p-3"><p className="text-sm font-semibold">{item.sourceTitle}</p><p className="mt-1 text-xs text-white/45">{item.status}{item.recordId ? ` · record ${item.recordId}` : ''} · observed {new Date(item.observedAt).toLocaleDateString()}</p></div>)}</div></div>
          <p className="mt-5 flex items-center gap-2 text-xs text-white/45"><CheckCircle2 size={14}/>Recommendations remain reviewable and do not publish, send or confirm records automatically.</p>
        </div>}
      </section>
    </div>
  </AppShell>;
}

function AnswerList({ title, values, empty }: { title: string; values: string[]; empty: string }) {
  return <div className="rounded-2xl border border-white/10 p-4"><h3 className="font-semibold">{title}</h3><ul className="mt-3 space-y-2 text-sm leading-6 text-white/65">{values.length ? values.map(item => <li key={item}>• {item}</li>) : <li>{empty}</li>}</ul></div>;
}
