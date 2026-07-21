import { useState, type FormEvent } from 'react';
import { z } from 'zod';

const schema = z.object({
  yourName: z.string().min(2),
  yourEmail: z.string().email(),
  guestName: z.string().min(2, 'Guest name is required'),
  guestEmail: z.string().email().optional().or(z.literal('')),
  why: z.string().min(20, 'Please explain why you\'re suggesting this guest'),
});

export default function SuggestAGuestPage() {
  const [form, setForm] = useState({ yourName: '', yourEmail: '', guestName: '', guestEmail: '', why: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      const fe: Record<string, string> = {};
      result.error.issues.forEach((i) => { if (i.path[0]) fe[String(i.path[0])] = i.message; });
      setErrors(fe);
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4" style={{ color: '#F8F4EC' }}>Suggestion Received</h1>
        <p className="text-lg" style={{ color: '#D8A7B1' }}>Thank you for helping us find the next voice for MAJESTIC Muse.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <header className="mb-10 text-center">
        <p className="text-xs tracking-[0.25em] uppercase mb-3" style={{ color: '#C9A227' }}>Nominations</p>
        <h1 className="text-4xl font-bold mb-4" style={{ color: '#F8F4EC' }}>Suggest a Guest</h1>
        <p className="text-lg" style={{ color: '#D8A7B1' }}>Know someone whose story needs to be heard? Nominate them.</p>
      </header>
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {[
          { name: 'yourName', label: 'Your Name', type: 'text' },
          { name: 'yourEmail', label: 'Your Email', type: 'email' },
          { name: 'guestName', label: "Guest's Name", type: 'text' },
          { name: 'guestEmail', label: "Guest's Email (optional)", type: 'email' },
        ].map((f) => (
          <div key={f.name}>
            <label htmlFor={f.name} className="block text-sm font-medium mb-2" style={{ color: '#F8F4EC' }}>{f.label}</label>
            <input id={f.name} name={f.name} type={f.type} value={form[f.name as keyof typeof form]} onChange={handleChange}
              className="w-full rounded-lg px-4 py-3 text-sm outline-none"
              style={{ backgroundColor: '#13102A', border: '1px solid #8B2C6F44', color: '#F8F4EC' }} />
            {errors[f.name] && <p className="mt-1 text-xs text-red-400">{errors[f.name]}</p>}
          </div>
        ))}
        <div>
          <label htmlFor="why" className="block text-sm font-medium mb-2" style={{ color: '#F8F4EC' }}>Why This Guest?</label>
          <textarea id="why" name="why" rows={5} value={form.why} onChange={handleChange}
            placeholder="What makes their story right for MAJESTIC Muse?"
            className="w-full rounded-lg px-4 py-3 text-sm outline-none resize-none"
            style={{ backgroundColor: '#13102A', border: '1px solid #8B2C6F44', color: '#F8F4EC' }} />
          {errors.why && <p className="mt-1 text-xs text-red-400">{errors.why}</p>}
        </div>
        <button type="submit" className="w-full py-3 rounded-xl font-semibold text-sm" style={{ backgroundColor: '#C9A227', color: '#1B1734' }}>
          Submit Nomination
        </button>
      </form>
    </div>
  );
}
