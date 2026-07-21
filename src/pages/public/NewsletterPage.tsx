import { useState, type FormEvent } from 'react';
export default function NewsletterPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (email) setSubmitted(true);
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center">
      <p className="text-xs tracking-[0.25em] uppercase mb-4" style={{ color: '#C9A227' }}>Stay Connected</p>
      <h1 className="text-4xl font-bold mb-6" style={{ color: '#F8F4EC' }}>Join the Newsletter</h1>
      <p className="text-lg mb-10" style={{ color: '#D8A7B1' }}>
        Updates, reflections, and announcements — delivered directly to you.
      </p>
      {submitted ? (
        <div className="rounded-2xl p-8" style={{ backgroundColor: '#13102A', border: '1px solid #C9A22744' }}>
          <p className="font-semibold" style={{ color: '#C9A227' }}>You're on the list!</p>
          <p className="text-sm mt-2" style={{ color: '#D8A7B1' }}>Thank you for joining the MAJESTIC Muse community.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col sm:flex-row gap-3">
          <label htmlFor="nl-email" className="sr-only">Email address</label>
          <input id="nl-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 rounded-xl px-5 py-3 text-sm outline-none"
            style={{ backgroundColor: '#13102A', border: '1px solid #8B2C6F44', color: '#F8F4EC' }} />
          <button type="submit" className="px-6 py-3 rounded-xl font-semibold text-sm" style={{ backgroundColor: '#C9A227', color: '#1B1734' }}>
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}
