export default function AccessibilityPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-8" style={{ color: '#F8F4EC' }}>Accessibility</h1>
      <div className="space-y-6 text-base leading-relaxed" style={{ color: '#D8A7B1' }}>
        <p>MAJESTIC Muse Media is committed to ensuring this website and its content are accessible to everyone, including people with disabilities.</p>
        <section>
          <h2 className="text-xl font-semibold mb-3" style={{ color: '#F8F4EC' }}>Our Commitment</h2>
          <p>We strive to meet WCAG 2.1 Level AA standards. This includes keyboard navigability, screen reader support, sufficient color contrast, and accessible form labels throughout the site.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-3" style={{ color: '#F8F4EC' }}>Feedback</h2>
          <p>If you encounter any accessibility barriers, please contact us at <a href="mailto:accessibility@majesticmusemedia.ai" style={{ color: '#C9A227' }}>accessibility@majesticmusemedia.ai</a>. We take all feedback seriously.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-3" style={{ color: '#F8F4EC' }}>Audio Content</h2>
          <p>We are working to provide transcripts for all podcast episodes. Transcripts will be available on each episode's page upon release.</p>
        </section>
      </div>
    </div>
  );
}
