import { Link } from 'react-router-dom';

interface ConnectionRequiredProps {
  platform: string;
  message?: string;
  settingsPath?: string;
}

export default function ConnectionRequired({ platform, message, settingsPath = '/app/settings' }: ConnectionRequiredProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
      <div className="text-5xl mb-4" aria-hidden="true" style={{ color: '#8B2C6F' }}>◌</div>
      <h3 className="text-lg font-semibold mb-2" style={{ color: '#F8F4EC' }}>
        {platform} Connection Required
      </h3>
      <p className="text-sm max-w-sm mb-6" style={{ color: '#D8A7B1' }}>
        {message ?? `Connect your ${platform} account to enable this feature. Your credentials are stored securely.`}
      </p>
      <Link to={settingsPath} className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80" style={{ backgroundColor: '#C9A227', color: '#1B1734' }}>
        Go to Settings
      </Link>
    </div>
  );
}
