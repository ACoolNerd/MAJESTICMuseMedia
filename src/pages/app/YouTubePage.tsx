import AppPageHeader from '../../components/ui/AppPageHeader';
import Card from '../../components/ui/Card';
import ConnectionRequired from '../../components/ui/ConnectionRequired';
import { youtubeAdapter } from '../../services/adapters/youtube.adapter';

export default function YouTubePage() {
  const status = youtubeAdapter.getStatus();

  return (
    <div>
      <AppPageHeader
        eyebrow="Publishing"
        title="YouTube"
        description="Manage YouTube-specific packaging, channel readiness, and premiere planning for MAJESTIC Muse episodes and clips."
      />
      {!status.isConnected && <ConnectionRequired platform={status.platform} message={status.message} />}
      <div className="grid gap-6 lg:grid-cols-2 mt-6">
        <Card variant="elevated">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#F8F4EC' }}>Packaging checklist</h2>
          <ul role="list" className="space-y-3 text-sm" style={{ color: '#D8A7B1' }}>
            <li>Title and description optimized for story clarity, not clickbait.</li>
            <li>Custom thumbnail aligned with editorial brand standards.</li>
            <li>Premiere notes and pinned comment drafted for community response.</li>
          </ul>
        </Card>
        <Card variant="elevated">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#F8F4EC' }}>Current state</h2>
          <p className="text-sm" style={{ color: '#D8A7B1' }}>
            {status.isConnected ? 'YouTube credentials are present. Channel workflows can be activated next.' : status.message}
          </p>
        </Card>
      </div>
    </div>
  );
}
