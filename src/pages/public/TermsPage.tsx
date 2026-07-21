export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-8" style={{ color: '#F8F4EC' }}>Terms of Use</h1>
      <div className="space-y-6 text-base leading-relaxed" style={{ color: '#D8A7B1' }}>
        <p><strong style={{ color: '#F8F4EC' }}>Effective Date:</strong> August 1, 2026</p>
        <section>
          <h2 className="text-xl font-semibold mb-3" style={{ color: '#F8F4EC' }}>Use of This Site</h2>
          <p>By using this site, you agree to these terms. This site and its content are owned by MAJESTIC Muse Media. You may not reproduce or redistribute content without written permission.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-3" style={{ color: '#F8F4EC' }}>Content</h2>
          <p>All podcast content, written materials, and media on this site are the intellectual property of MAJESTIC Muse Media and Marchette. Guests retain rights to their personal stories as shared on the platform.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-3" style={{ color: '#F8F4EC' }}>Contact</h2>
          <p>Questions? <a href="mailto:hello@majesticmusemedia.ai" style={{ color: '#C9A227' }}>hello@majesticmusemedia.ai</a></p>
        </section>
      </div>
    </div>
  );
}
