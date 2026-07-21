import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonicalPath: string;
  imageUrl?: string;
  jsonLd?: Record<string, unknown>;
}

const siteName = 'MAJESTIC Muse Podcast by Marchette';
const siteOrigin = 'https://MAJESTICMuseMedia.ai';

function upsertMeta(name: string, content: string, property = false) {
  const attribute = property ? 'property' : 'name';
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.content = content;
}

export function SEO({ title, description, canonicalPath, imageUrl, jsonLd }: SEOProps) {
  useEffect(() => {
    const fullTitle = title === siteName ? title : `${title} | ${siteName}`;
    const canonical = new URL(canonicalPath, siteOrigin).toString();
    document.title = fullTitle;
    upsertMeta('description', description);
    upsertMeta('og:title', fullTitle, true);
    upsertMeta('og:description', description, true);
    upsertMeta('og:type', 'website', true);
    upsertMeta('og:url', canonical, true);
    upsertMeta('twitter:card', imageUrl ? 'summary_large_image' : 'summary');
    upsertMeta('twitter:title', fullTitle);
    upsertMeta('twitter:description', description);
    if (imageUrl) {
      upsertMeta('og:image', imageUrl, true);
      upsertMeta('twitter:image', imageUrl);
    }

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = canonical;

    const id = 'majestic-muse-jsonld';
    document.getElementById(id)?.remove();
    if (jsonLd) {
      const script = document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => document.getElementById(id)?.remove();
  }, [canonicalPath, description, imageUrl, jsonLd, title]);

  return null;
}
