import Card from '../../components/ui/Card';
import Badge, { statusVariant } from '../../components/ui/Badge';
import { STAGE_LABELS, STATUS_LABELS, formatDateShort } from '../../lib/utils';
import type { Episode } from '../../types';

interface EpisodeCardProps {
  episode: Episode;
  onClick?: () => void;
}

export default function EpisodeCard({ episode, onClick }: EpisodeCardProps) {
  return (
    <Card
      variant="elevated"
      className="transition-opacity hover:opacity-90"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') onClick();
            }
          : undefined
      }
      aria-label={`${episode.seriesNumber}: ${episode.title}`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <span className="text-xs font-mono" style={{ color: '#C9A227' }}>
            {episode.seriesNumber}
          </span>
          <h3 className="text-base font-semibold mt-0.5" style={{ color: '#F8F4EC' }}>
            {episode.title}
          </h3>
        </div>
        <Badge variant={statusVariant[episode.status]}>{STATUS_LABELS[episode.status]}</Badge>
      </div>

      <p className="text-xs mb-4" style={{ color: '#D8A7B1' }}>
        {episode.description || 'No description yet.'}
      </p>

      <div className="flex flex-wrap gap-3 text-xs" style={{ color: '#D8A7B188' }}>
        <span>
          Stage: <span style={{ color: '#F8F4EC' }}>{STAGE_LABELS[episode.stage]}</span>
        </span>
        {episode.recordingDate && (
          <span>
            Recording: <span style={{ color: '#F8F4EC' }}>{formatDateShort(episode.recordingDate)}</span>
          </span>
        )}
        {episode.releaseDate && (
          <span>
            Release: <span style={{ color: '#F8F4EC' }}>{formatDateShort(episode.releaseDate)}</span>
          </span>
        )}
      </div>
    </Card>
  );
}
