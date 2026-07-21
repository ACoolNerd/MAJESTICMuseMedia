import { STAGE_LABELS } from '../../lib/utils';
import type { EpisodeStage } from '../../types';

const stageOrder: EpisodeStage[] = [
  'concept',
  'guest_development',
  'pre_production',
  'production_capture',
  'create_and_ingest',
  'cut',
  'package',
  'release',
  'amplify',
  'learn',
];

interface EpisodeWorkflowBadgeProps {
  stage: EpisodeStage;
  showProgress?: boolean;
}

export default function EpisodeWorkflowBadge({ stage, showProgress = false }: EpisodeWorkflowBadgeProps) {
  const index = stageOrder.indexOf(stage);
  const progress = Math.round(((index + 1) / stageOrder.length) * 100);

  return (
    <div className="inline-flex flex-col gap-1">
      <span
        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
        style={{ backgroundColor: '#8B2C6F22', color: '#D8A7B1', border: '1px solid #8B2C6F44' }}
        aria-label={`Workflow stage: ${STAGE_LABELS[stage]}`}
      >
        {STAGE_LABELS[stage]}
      </span>
      {showProgress && (
        <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: '#8B2C6F22', width: '100%' }} role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Episode workflow: ${progress}% complete`}>
          <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: '#C9A227' }} />
        </div>
      )}
    </div>
  );
}
