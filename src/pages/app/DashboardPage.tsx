import { Link } from 'react-router-dom';
import AppPageHeader from '../../components/ui/AppPageHeader';
import Card from '../../components/ui/Card';
import ReleaseGateStatus from '../../components/ui/ReleaseGateStatus';
import StatCard from '../../components/ui/StatCard';
import EpisodeWorkflowBadge from '../../features/episodes/EpisodeWorkflowBadge';
import { seedEpisodes, seedGuests } from '../../lib/seed-data';
import { formatDate, formatDateShort } from '../../lib/utils';

export default function DashboardPage() {
  const upcomingRecording = seedEpisodes.find((episode) => episode.seriesNumber === 'S01E01');
  const rebecca = seedGuests.find((guest) => guest.name === 'Rebecca');
  const confirmedCount = seedEpisodes.filter((episode) => episode.status === 'confirmed').length;
  const proposedCount = seedEpisodes.filter((episode) => episode.status === 'proposed').length;

  if (!upcomingRecording || !rebecca) {
    return null;
  }

  return (
    <div>
      <AppPageHeader
        eyebrow="Executive dashboard"
        title="Welcome back, Marchette"
        description="Here is the current pulse of the MAJESTIC Muse studio: what is recording next, what is moving through the pipeline, and what needs attention before release."
        actions={
          <>
            <Link to="/app/episodes" className="rounded-lg px-5 py-3 text-sm font-semibold" style={{ backgroundColor: '#C9A227', color: '#1B1734' }}>
              Open episodes
            </Link>
            <Link to="/app/approvals" className="rounded-lg px-5 py-3 text-sm font-semibold" style={{ border: '1px solid #C9A227', color: '#C9A227' }}>
              Review approvals
            </Link>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-8">
        <StatCard label="Season 1 episodes" value="4" note="One confirmed episode and three proposed conversations are mapped." />
        <StatCard label="Confirmed" value={String(confirmedCount)} note="S01E01 is actively moving through production capture and release prep." />
        <StatCard label="Proposed" value={String(proposedCount)} note="Three concepts are in curation, outreach, or development." />
        <StatCard label="Next recording" value="July 24" note="Rebecca joins Marchette for the debut recording of IDENTITY." />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr] mb-8">
        <Card variant="elevated">
          <p className="text-xs uppercase tracking-[0.3em] mb-2" style={{ color: '#8B2C6F' }}>Upcoming recording</p>
          <h2 className="text-2xl font-semibold mb-3" style={{ color: '#F8F4EC' }}>
            {upcomingRecording.seriesNumber} · {upcomingRecording.title}
          </h2>
          <p className="text-sm mb-4" style={{ color: '#D8A7B1' }}>
            Recording date: {formatDate(upcomingRecording.recordingDate)} with {rebecca.name}. This debut conversation sets the tone for the entire flagship series.
          </p>
          <div className="flex flex-wrap gap-4 text-sm" style={{ color: '#F8F4EC' }}>
            <span>Guest: {rebecca.name}</span>
            <span>Release target: {formatDateShort(upcomingRecording.releaseDate)}</span>
          </div>
          <div className="mt-5">
            <EpisodeWorkflowBadge stage={upcomingRecording.stage} showProgress />
          </div>
        </Card>
        <Card variant="elevated">
          <p className="text-xs uppercase tracking-[0.3em] mb-3" style={{ color: '#8B2C6F' }}>Release gates for S01E01</p>
          <ReleaseGateStatus gates={upcomingRecording.releaseGates} />
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <Card variant="elevated">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#F8F4EC' }}>Episode pipeline summary</h2>
          <ul role="list" className="space-y-3 text-sm" style={{ color: '#D8A7B1' }}>
            {seedEpisodes.map((episode) => (
              <li key={episode.id} className="flex items-start justify-between gap-4">
                <div>
                  <p style={{ color: '#F8F4EC' }}>{episode.seriesNumber} · {episode.title}</p>
                  <p>{episode.description}</p>
                </div>
                <EpisodeWorkflowBadge stage={episode.stage} />
              </li>
            ))}
          </ul>
        </Card>
        <Card variant="elevated">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#F8F4EC' }}>Quick actions</h2>
          <div className="grid gap-3 text-sm">
            {[
              ['/app/episodes', 'Refine episode pipeline'],
              ['/app/guests', 'Review guest development'],
              ['/app/review', 'Open review notes'],
              ['/app/distribution', 'Check distribution readiness'],
              ['/app/live', 'Prepare live studio'],
              ['/app/settings', 'Verify integrations'],
            ].map(([to, label]) => (
              <Link key={to} to={to} className="rounded-lg px-4 py-3" style={{ backgroundColor: '#8B2C6F22', color: '#F8F4EC', border: '1px solid #8B2C6F33' }}>
                {label}
              </Link>
            ))}
          </div>
        </Card>
        <Card variant="elevated">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#F8F4EC' }}>Season 1 overview</h2>
          <p className="text-sm mb-4" style={{ color: '#D8A7B1' }}>
            Season 1 is anchored in stories of identity, faith, motherhood, creative calling, and worship leadership. The throughline is becoming.
          </p>
          <ul role="list" className="space-y-2 text-sm" style={{ color: '#F8F4EC' }}>
            <li>• Debut episode confirmed and scheduled.</li>
            <li>• Three additional story arcs are proposed for curation and outreach.</li>
            <li>• Editorial packaging, rights, and metadata remain the main release risks.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
