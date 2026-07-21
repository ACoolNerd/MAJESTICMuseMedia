import AppPageHeader from '../../components/ui/AppPageHeader';
import Card from '../../components/ui/Card';
import { validateEnv } from '../../config/env';
import { googleCalendarAdapter } from '../../services/adapters/googlecalendar.adapter';
import { googleDriveAdapter } from '../../services/adapters/googledrive.adapter';
import { kickAdapter } from '../../services/adapters/kick.adapter';
import { twitchAdapter } from '../../services/adapters/twitch.adapter';
import { youtubeAdapter } from '../../services/adapters/youtube.adapter';

export default function SettingsPage() {
  const envStatus = validateEnv();
  const integrations = [
    youtubeAdapter.getStatus(),
    twitchAdapter.getStatus(),
    kickAdapter.getStatus(),
    googleDriveAdapter.getStatus(),
    googleCalendarAdapter.getStatus(),
  ];

  return (
    <div>
      <AppPageHeader
        eyebrow="Workflow"
        title="Settings and integrations"
        description="Verify environment configuration, review connection status, and prepare the studio to move from demo mode into full production."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card variant="elevated">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#F8F4EC' }}>Environment validation</h2>
          {envStatus.success ? (
            <p className="text-sm" style={{ color: '#4ADE80' }}>
              Core Firebase environment variables are configured.
            </p>
          ) : (
            <ul role="list" className="space-y-2 text-sm" style={{ color: '#D8A7B1' }}>
              {envStatus.errors.map((error) => <li key={error}>{error}</li>)}
            </ul>
          )}
        </Card>
        <Card variant="elevated">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#F8F4EC' }}>Integration status</h2>
          <ul role="list" className="space-y-3 text-sm" style={{ color: '#D8A7B1' }}>
            {integrations.map((integration) => (
              <li key={integration.platform} className="rounded-lg px-4 py-3" style={{ backgroundColor: '#FFFFFF08' }}>
                <span style={{ color: '#F8F4EC' }}>{integration.platform}:</span> {integration.isConnected ? 'Connected' : integration.message}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
