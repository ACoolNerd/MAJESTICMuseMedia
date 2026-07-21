interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export default function LoadingSpinner({ size = 'md', label = 'Loading…' }: LoadingSpinnerProps) {
  const sizeMap = { sm: 20, md: 36, lg: 56 };
  const spinnerSize = sizeMap[size];

  return (
    <div role="status" aria-label={label} className="flex flex-col items-center gap-3">
      <svg width={spinnerSize} height={spinnerSize} viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ animation: 'spin 1s linear infinite' }}>
        <circle cx="12" cy="12" r="10" stroke="#8B2C6F" strokeWidth="2" opacity="0.3" />
        <path d="M12 2a10 10 0 0 1 10 10" stroke="#C9A227" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <span className="sr-only">{label}</span>
    </div>
  );
}
