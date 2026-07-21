import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Card from './Card';

interface BrandPageSection {
  title: string;
  body: string[];
  bullets?: string[];
  callout?: string;
}

interface BrandPageProps {
  eyebrow: string;
  title: string;
  description: string;
  sections: BrandPageSection[];
  aside?: ReactNode;
  cta?: { label: string; to: string };
}

export default function BrandPage({ eyebrow, title, description, sections, aside, cta }: BrandPageProps) {
  return (
    <div>
      <section className="px-6 py-20 md:py-28" aria-label={`${title} hero`} style={{ background: 'linear-gradient(180deg, #1B1734 0%, #241343 100%)' }}>
        <div className="max-w-5xl mx-auto grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-start">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em]" style={{ color: '#8B2C6F' }}>
              {eyebrow}
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6" style={{ color: '#F8F4EC' }}>
              {title}
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed" style={{ color: '#D8A7B1' }}>
              {description}
            </p>
            {cta && (
              <Link to={cta.to} className="inline-flex mt-8 rounded-lg px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-80" style={{ backgroundColor: '#C9A227', color: '#1B1734' }}>
                {cta.label}
              </Link>
            )}
          </div>
          {aside && <div>{aside}</div>}
        </div>
      </section>

      <section className="px-6 py-16 md:py-20" aria-label={`${title} details`}>
        <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {sections.map((section) => (
            <Card key={section.title} variant="elevated" className="h-full">
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#F8F4EC' }}>
                {section.title}
              </h2>
              <div className="space-y-3 text-sm" style={{ color: '#D8A7B1' }}>
                {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              {section.bullets && (
                <ul role="list" className="mt-4 space-y-2 text-sm" style={{ color: '#F8F4EC' }}>
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2">
                      <span aria-hidden="true" style={{ color: '#C9A227' }}>✦</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
              {section.callout && (
                <p className="mt-5 rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: '#8B2C6F22', color: '#F8F4EC', border: '1px solid #8B2C6F33' }}>
                  {section.callout}
                </p>
              )}
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
