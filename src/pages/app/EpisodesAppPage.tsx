import AppPageHeader from '../../components/ui/AppPageHeader';
import Card from '../../components/ui/Card';
import EpisodeWorkflowBadge from '../../features/episodes/EpisodeWorkflowBadge';
import { seedEpisodes } from '../../lib/seed-data';
import { STAGE_LABELS, STATUS_LABELS, formatDateShort } from '../../lib/utils';

export default function EpisodesAppPage() {
  return (
    <div>
      <AppPageHeader
        eyebrow="Production"
        title="Episode pipeline"
        description="Track every episode from early concept through release, with enough structure to protect quality while still moving quickly."
      />
      <div className="grid gap-6">
        {seedEpisodes.map((episode) => (
          <Card key={episode.id} variant="elevated">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] mb-2" style={{ color: '#8B2C6F' }}>{episode.seriesNumber}</p>
                <h2 className="text-2xl font-semibold mb-2" style={{ color: '#F8F4EC' }}>{episode.title}</h2>
                <p className="text-sm max-w-3xl" style={{ color: '#D8A7B1' }}>{episode.description}</p>
              </div>
              <EpisodeWorkflowBadge stage={episode.stage} showProgress />
            </div>
            <div className="grid gap-3 md:grid-cols-4 mt-6 text-sm">
              <div>
                <p style={{ color: '#8B2C6F' }}>Status</p>
                <p style={{ color: '#F8F4EC' }}>{STATUS_LABELS[episode.status]}</p>
              </div>
              <div>
                <p style={{ color: '#8B2C6F' }}>Stage</p>
                <p style={{ color: '#F8F4EC' }}>{STAGE_LABELS[episode.stage]}</p>
              </div>
              <div>
                <p style={{ color: '#8B2C6F' }}>Recording</p>
                <p style={{ color: '#F8F4EC' }}>{formatDateShort(episode.recordingDate)}</p>
              </div>
              <div>
                <p style={{ color: '#8B2C6F' }}>Release</p>
                <p style={{ color: '#F8F4EC' }}>{formatDateShort(episode.releaseDate)}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
