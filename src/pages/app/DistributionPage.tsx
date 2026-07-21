import AppPageHeader from '../../components/ui/AppPageHeader';
import Card from '../../components/ui/Card';
import ConnectionRequired from '../../components/ui/ConnectionRequired';
import { youtubeAdapter } from '../../services/adapters/youtube.adapter';

const jobs = [
  { destination: 'Website episode page', status: 'Draft metadata ready' },
  { destination: 'YouTube premiere', status: 'Awaiting channel connection' },
  { destination: 'Newsletter announcement', status: 'Queued after launch copy approval' },
];

export default function DistributionPage() {
  const youtubeStatus = youtubeAdapter.getStatus();

  return (
    <div>
      <AppPageHeader
        eyebrow="Publishing"
        title="Distribution"
        description="Coordinate where each episode should go, what is scheduled, and what still needs connection or approval before the audience sees it."
      />
      {!youtubeStatus.isConnected && <ConnectionRequired platform="Distribution destinations" message="Primary launch destinations are not fully connected yet. Configure YouTube and publishing channels in Settings first." />}
      <Card variant="elevated">
        <h2 className="text-xl font-semibold mb-4" style={{ color: '#F8F4EC' }}>Launch queue</h2>
        <ul role="list" className="space-y-3 text-sm" style={{ color: '#D8A7B1' }}>
          {jobs.map((job) => (
            <li key={job.destination} className="flex items-start justify-between gap-4 rounded-lg px-4 py-3" style={{ backgroundColor: '#FFFFFF08' }}>
              <span style={{ color: '#F8F4EC' }}>{job.destination}</span>
              <span>{job.status}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
