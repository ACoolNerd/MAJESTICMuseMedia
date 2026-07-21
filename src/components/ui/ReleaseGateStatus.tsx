import type { ReleaseGates } from '../../types';
import { RELEASE_GATE_LABELS } from '../../lib/utils';
import Badge, { gateStatusVariant } from './Badge';

interface ReleaseGateStatusProps {
  gates: ReleaseGates;
}

const gateNames: Array<{ key: keyof ReleaseGates; label: string }> = [
  { key: 'story', label: 'Story' },
  { key: 'technical', label: 'Technical' },
  { key: 'brand', label: 'Brand' },
  { key: 'rights', label: 'Rights' },
  { key: 'metadata', label: 'Metadata' },
];

export default function ReleaseGateStatusComponent({ gates }: ReleaseGateStatusProps) {
  return (
    <div aria-label="Release gate statuses" className="space-y-2">
      {gateNames.map(({ key, label }) => {
        const gate = gates[key];
        return (
          <div key={key} className="flex items-center justify-between gap-4">
            <span className="text-sm" style={{ color: '#D8A7B1' }}>{label}</span>
            <Badge variant={gateStatusVariant[gate.status]}>{RELEASE_GATE_LABELS[gate.status]}</Badge>
          </div>
        );
      })}
    </div>
  );
}
