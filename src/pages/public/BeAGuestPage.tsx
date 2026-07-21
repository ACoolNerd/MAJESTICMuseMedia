import { useState, type FormEvent } from 'react';
import { z } from 'zod';

const guestSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  topic: z.string().min(10, 'Please describe your story topic (min 10 characters)'),
  message: z.string().min(20, 'Please tell us more about yourself (min 20 characters)'),
});

export default function BeAGuestPage() {
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = guestSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[String(issue.path[0])] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <p className="text-4xl mb-4" aria-hidden="true">✦</p>
        <h1 className="text-3xl font-bold mb-4" style={{ color: '#F8F4EC' }}>Application Received</h1>
        <p className="text-lg" style={{ color: '#D8A7B1' }}>
          Thank you for applying to be a guest on MAJESTIC Muse. We'll be in touch if your story
          is a fit for our upcoming season.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <header className="mb-10 text-center">
        <p className="text-xs tracking-[0.25em] uppercase mb-3" style={{ color: '#C9A227' }}>Guest Applications</p>
        <h1 className="text-4xl font-bold mb-4" style={{ color: '#F8F4EC' }}>Be a Guest</h1>
        <p className="text-lg" style={{ color: '#D8A7B1' }}>
          Your story matters. Apply to join Marchette for a conversation on MAJESTIC Muse.
        </p>
      </header>

      <form onSubmit={handleSubmit} noValidate aria-label="Guest application form" className="space-y-6">
        {[
          { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
          { name: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com' },
        ].map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-medium mb-2" style={{ color: '#F8F4EC' }}>{field.label}</label>
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={form[field.name as keyof typeof form]}
              onChange={handleChange}
              className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#C9A227]"
              style={{ backgroundColor: '#13102A', border: `1px solid ${errors[field.name] ? '#F87171' : '#8B2C6F44'}`, color: '#F8F4EC' }}
              aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
            />
            {errors[field.name] && <p id={`${field.name}-error`} role="alert" className="mt-1 text-xs text-red-400">{errors[field.name]}</p>}
          </div>
        ))}

        <div>
          <label htmlFor="topic" className="block text-sm font-medium mb-2" style={{ color: '#F8F4EC' }}>Your Story Topic</label>
          <input
            id="topic"
            name="topic"
            type="text"
            placeholder="What would you like to talk about?"
            value={form.topic}
            onChange={handleChange}
            className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#C9A227]"
            style={{ backgroundColor: '#13102A', border: `1px solid ${errors.topic ? '#F87171' : '#8B2C6F44'}`, color: '#F8F4EC' }}
          />
          {errors.topic && <p role="alert" className="mt-1 text-xs text-red-400">{errors.topic}</p>}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2" style={{ color: '#F8F4EC' }}>About You</label>
          <textarea
            id="message"
            name="message"
            rows={5}
            placeholder="Tell us about yourself, your faith journey, and why you'd like to be a guest..."
            value={form.message}
            onChange={handleChange}
            className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#C9A227] resize-none"
            style={{ backgroundColor: '#13102A', border: `1px solid ${errors.message ? '#F87171' : '#8B2C6F44'}`, color: '#F8F4EC' }}
          />
          {errors.message && <p role="alert" className="mt-1 text-xs text-red-400">{errors.message}</p>}
        </div>

        <button type="submit" className="w-full py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90" style={{ backgroundColor: '#C9A227', color: '#1B1734' }}>
          Submit Application
        </button>
      </form>
    </div>
  );
}
