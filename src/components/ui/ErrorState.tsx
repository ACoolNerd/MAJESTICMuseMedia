interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center py-20 text-center px-6">
      <div className="text-5xl mb-4" aria-hidden="true" style={{ color: '#F87171' }}>⚠</div>
      <h3 className="text-lg font-semibold mb-2" style={{ color: '#F8F4EC' }}>{title}</h3>
      <p className="text-sm max-w-sm" style={{ color: '#D8A7B1' }}>{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="mt-6 px-5 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80" style={{ backgroundColor: '#8B2C6F', color: '#F8F4EC' }}>
          Try Again
        </button>
      )}
    </div>
  );
}
