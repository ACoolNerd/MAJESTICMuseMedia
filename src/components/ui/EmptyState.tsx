interface EmptyStateProps {
  title: string;
  message?: string;
  action?: { label: string; onClick: () => void };
  icon?: string;
}

export default function EmptyState({ title, message, action, icon = '◉' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
      <div className="text-5xl mb-4" aria-hidden="true" style={{ color: '#8B2C6F44' }}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2" style={{ color: '#F8F4EC' }}>
        {title}
      </h3>
      {message && <p className="text-sm max-w-sm" style={{ color: '#D8A7B1' }}>{message}</p>}
      {action && (
        <button type="button" onClick={action.onClick} className="mt-6 px-5 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80" style={{ backgroundColor: '#C9A227', color: '#1B1734' }}>
          {action.label}
        </button>
      )}
    </div>
  );
}
