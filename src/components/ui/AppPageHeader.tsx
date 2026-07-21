import type { ReactNode } from 'react';

interface AppPageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}

export default function AppPageHeader({ eyebrow, title, description, actions }: AppPageHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em]" style={{ color: '#8B2C6F' }}>
          {eyebrow}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold" style={{ color: '#F8F4EC' }}>{title}</h1>
        <p className="mt-3 max-w-3xl text-sm md:text-base" style={{ color: '#D8A7B1' }}>{description}</p>
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </header>
  );
}
