import { useState, type FormEvent } from 'react';
import { z } from 'zod';

const storySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  story: z.string().min(50, 'Please share more of your story (min 50 characters)'),
});

export default function SubmitYourStoryPage() {
  const [form, setForm] = useState({ name: '', email: '', story: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = storySchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((i) => { if (i.path[0]) fieldErrors[String(i.path[0])] = i.message; });
      setErrors(fieldErrors);
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4" style={{ color: '#F8F4EC' }}>Thank You for Sharing</h1>
        <p className="text-lg" style={{ color: '#D8A7B1' }}>Your story has been received. Every story planted here is a seed.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <header className="mb-10 text-center">
        <p className="text-xs tracking-[0.25em] uppercase mb-3" style={{ color: '#C9A227' }}>Community</p>
        <h1 className="text-4xl font-bold mb-4" style={{ color: '#F8F4EC' }}>Submit Your Story</h1>
        <p className="text-lg" style={{ color: '#D8A7B1' }}>Every story matters. Share a moment where faith met purpose in your life.</p>
      </header>
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {[{ name: 'name', label: 'Name', type: 'text' }, { name: 'email', label: 'Email', type: 'email' }].map((f) => (
          <div key={f.name}>
            <label htmlFor={f.name} className="block text-sm font-medium mb-2" style={{ color: '#F8F4EC' }}>{f.label}</label>
            <input id={f.name} name={f.name} type={f.type} value={form[f.name as keyof typeof form]} onChange={handleChange}
              className="w-full rounded-lg px-4 py-3 text-sm outline-none"
              style={{ backgroundColor: '#13102A', border: '1px solid #8B2C6F44', color: '#F8F4EC' }} />
            {errors[f.name] && <p className="mt-1 text-xs text-red-400">{errors[f.name]}</p>}
          </div>
        ))}
        <div>
          <label htmlFor="story" className="block text-sm font-medium mb-2" style={{ color: '#F8F4EC' }}>Your Story</label>
          <textarea id="story" name="story" rows={8} value={form.story} onChange={handleChange}
            placeholder="Share your story here..."
            className="w-full rounded-lg px-4 py-3 text-sm outline-none resize-none"
            style={{ backgroundColor: '#13102A', border: '1px solid #8B2C6F44', color: '#F8F4EC' }} />
          {errors.story && <p className="mt-1 text-xs text-red-400">{errors.story}</p>}
        </div>
        <button type="submit" className="w-full py-3 rounded-xl font-semibold text-sm" style={{ backgroundColor: '#C9A227', color: '#1B1734' }}>
          Share My Story
        </button>
      </form>
    </div>
  );
}
