import { useState, type FormEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Send, Sparkles } from 'lucide-react';
import { z } from 'zod';
import { PublicHeader } from '../components/Shell';
import { useOperations } from '../features/operations/OperationsContext';
import type { FormType } from '../features/operations/types';

const formSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name.'),
  email: z.string().trim().email('Enter a valid email address.'),
  organization: z.string().trim().max(120).optional(),
  message: z.string().trim().min(10, 'Share at least 10 characters.'),
  consent: z.literal(true, { error: 'Consent is required to submit this form.' }),
});

const formConfig: Record<string, { type: FormType; eyebrow: string; title: string; messageLabel: string; helper: string }> = {
  '/be-a-guest': { type: 'guest-interest', eyebrow: 'Guest Interest', title: 'Bring your story to the MAJESTIC Muse table.', messageLabel: 'Your story, expertise and proposed conversation', helper: 'Share the transformation, practical value and audience benefit you would bring.' },
  '/submit-your-story': { type: 'community-story', eyebrow: 'Community Story', title: 'Your experience may help someone find their voice.', messageLabel: 'Tell us your story', helper: 'Please avoid including information you do not have permission to share.' },
  '/suggest-a-guest': { type: 'guest-suggestion', eyebrow: 'Guest Suggestion', title: 'Who belongs in this conversation?', messageLabel: 'Who are you suggesting and why?', helper: 'Include a public link or contact path where appropriate.' },
  '/work-with-us': { type: 'media-services', eyebrow: 'Media Services', title: 'Turn a meaningful message into a complete media system.', messageLabel: 'Project, desired outcome, platforms, deadline and budget range', helper: 'Tell us what exists today and what success should look like.' },
  '/partners': { type: 'sponsor-inquiry', eyebrow: 'Partnerships', title: 'Build an aligned partnership around purpose-led media.', messageLabel: 'Campaign objective, audience, timing and requested inventory', helper: 'All partnerships remain subject to brand, rights and disclosure approval.' },
  '/newsletter': { type: 'newsletter', eyebrow: 'MAJESTIC Muse Letter', title: 'Stay close to the conversations that move purpose forward.', messageLabel: 'What themes would help you most?', helper: 'Choose identity, faith, purpose, leadership, family, creativity or legacy.' },
};

export default function PublicForm() {
  const location = useLocation();
  const config = formConfig[location.pathname] ?? formConfig['/be-a-guest'];
  const { submitForm, persistenceMode } = useOperations();
  const [errors, setErrors] = useState<string[]>([]);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setErrors([]);
    const data = new FormData(event.currentTarget);
    const parsed = formSchema.safeParse({
      name: data.get('name'),
      email: data.get('email'),
      organization: data.get('organization') || undefined,
      message: data.get('message'),
      consent: data.get('consent') === 'on',
    });
    if (!parsed.success) {
      setErrors(parsed.error.issues.map(issue => issue.message));
      setSubmitting(false);
      return;
    }
    try {
      const id = await submitForm({
        formType: config.type,
        consent: true,
        source: `MAJESTICMuseMedia.ai${location.pathname}`,
        payload: parsed.data,
      });
      setSubmissionId(id);
      event.currentTarget.reset();
    } catch (caught) {
      setErrors([caught instanceof Error ? caught.message : 'Submission failed. Please try again.']);
    } finally {
      setSubmitting(false);
    }
  }

  return <main className="min-h-screen bg-[#F8F4EC] text-[#1B1734]">
    <section className="muse-gradient relative min-h-[38vh] text-[#F8F4EC]"><PublicHeader/><div className="mx-auto max-w-6xl px-5 pb-16 pt-32 md:px-10"><span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm"><Sparkles size={16} className="text-[#C9A227]"/>{config.eyebrow}</span><h1 className="mt-6 max-w-4xl font-serif text-4xl leading-tight md:text-6xl">{config.title}</h1></div></section>
    <section className="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:px-10 lg:grid-cols-[1fr_.7fr]">
      <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[#1B1734]/5 md:p-8">
        {submissionId ? <div className="py-10 text-center"><CheckCircle2 className="mx-auto text-green-700" size={48}/><h2 className="mt-5 font-serif text-3xl">Your submission is recorded.</h2><p className="mt-3 text-[#1B1734]/60">Reference: {submissionId}. The team will review it through the appropriate workflow.</p><button onClick={() => setSubmissionId(null)} className="mt-6 rounded-full bg-[#1B1734] px-6 py-3 font-semibold text-white">Submit another</button></div> : <form onSubmit={submit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2"><Field name="name" label="Name" required/><Field name="email" label="Email" type="email" required/></div>
          <Field name="organization" label="Organization or public profile"/>
          <label className="block text-sm font-semibold">{config.messageLabel}<textarea name="message" required rows={7} className="mt-2 w-full rounded-2xl border border-[#1B1734]/15 bg-white px-4 py-3 outline-none focus:border-[#8B2C6F]"/><span className="mt-2 block text-xs font-normal text-[#1B1734]/50">{config.helper}</span></label>
          <label className="flex items-start gap-3 rounded-2xl bg-[#F8F4EC] p-4 text-sm leading-6"><input name="consent" type="checkbox" className="mt-1"/><span>I consent to MAJESTIC Muse Media storing this submission and contacting me about it. I confirm I have the right to share the information provided.</span></label>
          {errors.length > 0 && <div role="alert" className="rounded-2xl bg-red-50 p-4 text-sm text-red-800">{errors.map(error => <p key={error}>{error}</p>)}</div>}
          <button disabled={submitting} className="inline-flex items-center gap-2 rounded-full bg-[#8B2C6F] px-6 py-3 font-semibold text-white disabled:opacity-50"><Send size={17}/>{submitting ? 'Submitting…' : 'Submit securely'}</button>
        </form>}
      </div>
      <aside className="space-y-5"><div className="rounded-[2rem] bg-[#1B1734] p-6 text-white"><h2 className="font-serif text-2xl">What happens next</h2><p className="mt-3 leading-7 text-white/65">Your submission enters the private review queue as New. It is not automatically published, approved, booked or shared with advertisers.</p></div><div className="rounded-[2rem] bg-white p-6 ring-1 ring-[#1B1734]/5"><p className="text-xs font-bold uppercase tracking-widest text-[#8B2C6F]">Persistence</p><p className="mt-3 text-sm leading-6 text-[#1B1734]/60">Mode: {persistenceMode}. Production forms require the approved Firebase project and security review.</p></div><Link to="/privacy" className="block text-sm font-semibold text-[#8B2C6F]">Review privacy information →</Link></aside>
    </section>
  </main>;
}

function Field({ name, label, type = 'text', required = false }: { name: string; label: string; type?: string; required?: boolean }) {
  return <label className="block text-sm font-semibold">{label}<input name={name} type={type} required={required} className="mt-2 w-full rounded-2xl border border-[#1B1734]/15 bg-white px-4 py-3 outline-none focus:border-[#8B2C6F]"/></label>;
}
