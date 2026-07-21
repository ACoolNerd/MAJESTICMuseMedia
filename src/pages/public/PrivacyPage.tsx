export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-8" style={{ color: '#F8F4EC' }}>Privacy Policy</h1>
      <div className="space-y-6 text-base leading-relaxed" style={{ color: '#D8A7B1' }}>
        <p><strong style={{ color: '#F8F4EC' }}>Effective Date:</strong> August 1, 2026</p>
        <section>
          <h2 className="text-xl font-semibold mb-3" style={{ color: '#F8F4EC' }}>Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you submit a guest application, suggest a guest, subscribe to our newsletter, or contact us. This may include your name, email address, and any message content you share.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-3" style={{ color: '#F8F4EC' }}>How We Use Your Information</h2>
          <p>We use the information we collect to respond to your inquiries, send you updates you have requested, and improve our services. We do not sell your personal information to third parties.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-3" style={{ color: '#F8F4EC' }}>Contact</h2>
          <p>Questions about this policy? Contact us at <a href="mailto:hello@majesticmusemedia.ai" style={{ color: '#C9A227' }}>hello@majesticmusemedia.ai</a>.</p>
        </section>
      </div>
    </div>
  );
}
