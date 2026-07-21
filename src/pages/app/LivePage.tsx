import AppPageHeader from '../../components/ui/AppPageHeader';
import Card from '../../components/ui/Card';
import ConnectionRequired from '../../components/ui/ConnectionRequired';
import { kickAdapter } from '../../services/adapters/kick.adapter';
import { twitchAdapter } from '../../services/adapters/twitch.adapter';
import { youtubeAdapter } from '../../services/adapters/youtube.adapter';

export default function LiveAppPage() {
  const statuses = [youtubeAdapter.getStatus(), twitchAdapter.getStatus(), kickAdapter.getStatus()];
  const connectedCount = statuses.filter((status) => status.isConnected).length;

  return (
    <div>
      <AppPageHeader
        eyebrow="Publishing"
        title="Live studio"
        description="Prepare live recordings, prayer rooms, and simulcast events with clear connection visibility before you go on air."
      />
      {connectedCount === 0 ? (
        <ConnectionRequired platform="Live streaming" message="No live destinations are configured yet. Connect YouTube, Twitch, or KICK before scheduling a studio event." />
      ) : null}
      <div className="grid gap-6 lg:grid-cols-2 mt-6">
        <Card variant="elevated">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#F8F4EC' }}>Stream readiness</h2>
          <ul role="list" className="space-y-3 text-sm" style={{ color: '#D8A7B1' }}>
            {statuses.map((status) => (
              <li key={status.platform}>
                <span style={{ color: '#F8F4EC' }}>{status.platform}:</span> {status.isConnected ? 'Connected' : status.message}
              </li>
            ))}
          </ul>
        </Card>
        <Card variant="elevated">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#F8F4EC' }}>Planned live format</h2>
          <p className="text-sm mb-3" style={{ color: '#D8A7B1' }}>
            Debut live nights should include a short welcome, the featured conversation, a guided reflection, and a clear invitation into the newsletter and community.
          </p>
          <p className="text-sm" style={{ color: '#D8A7B1' }}>
            No automated publishing or AI replies are enabled from this foundation.
          </p>
        </Card>
      </div>
    </div>
  );
}
