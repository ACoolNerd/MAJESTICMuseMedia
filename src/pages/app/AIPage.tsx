import AppPageHeader from '../../components/ui/AppPageHeader';
import Card from '../../components/ui/Card';

export default function AIPage() {
  return (
    <div>
      <AppPageHeader
        eyebrow="Intelligence"
        title="AI assist"
        description="Define safe ways to draft show notes, repurpose clips, and prepare metadata—without ever auto-publishing content or impersonating human care."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card variant="elevated">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#F8F4EC' }}>Guardrails</h2>
          <ul role="list" className="space-y-3 text-sm" style={{ color: '#D8A7B1' }}>
            <li>No automatic publishing to public channels.</li>
            <li>No AI-only replies in community contexts.</li>
            <li>Human review required for all final copy and metadata.</li>
          </ul>
        </Card>
        <Card variant="elevated">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#F8F4EC' }}>Likely use cases</h2>
          <p className="text-sm" style={{ color: '#D8A7B1' }}>
            Draft episode summaries, social caption options, show-note structures, and editorial repurposing ideas while preserving the unmistakable MAJESTIC Muse voice through human refinement.
          </p>
        </Card>
      </div>
    </div>
  );
}
