# Phase 10 — Approved public content experience

This phase replaces generic public placeholders with a truthful, accessible, search-ready MAJESTIC Muse website experience.

## Included

- Dedicated public-content data model separate from private production records
- Firestore public-content repository using `publicContent/{type}/items`
- Approved static fallback when the public Firestore collection is empty or unavailable
- Episode library and episode detail pages
- Guest directory and guest detail pages
- Verified livestream page
- Clips, articles, community, about, privacy, terms, community-guidelines, and accessibility pages
- Public navigation, skip link, footer, and responsive page shell
- Document metadata, canonical URLs, Open Graph, Twitter metadata, and JSON-LD helper
- `robots.txt` excluding the private application and login routes
- Public XML sitemap
- Tests preventing unverified published media or live links from appearing

## Public/private separation

Private production records are not the public content source.

The public site reads only records intentionally placed under:

- `publicContent/episodes/items`
- `publicContent/guests/items`
- `publicContent/clips/items`
- `publicContent/articles/items`
- `publicContent/live/items`

If those collections are empty, the app uses a tightly limited approved static fallback. The fallback currently contains one Upcoming episode association and no Published media, clips, articles, transcripts, replays, sponsor claims, performance metrics, or external platform links.

## Publication truth rules

- A Scheduled internal episode is represented publicly as Upcoming only when an approved public record exists.
- Proposed and TBD private records are not automatically copied to the public site.
- A successful upload does not create a public episode.
- Video, audio, transcript, chapter, image, replay, guest biography, website, and social links appear only when their approved public fields exist.
- The public live page displays no platform link until the event and URL are verified.
- Guest pages do not fabricate biography, title, credentials, organizations, achievements, or links.
- Clips and articles display only records with Published status.
- Legal routes remain visibly pending final approval where final policy language does not yet exist.

## SEO

The SEO helper manages:

- document title
- meta description
- canonical URL
- Open Graph metadata
- Twitter metadata
- optional image metadata
- JSON-LD structured data

The episode detail page uses a PodcastEpisode or VideoObject schema based on whether an approved video URL exists.

## Accessibility

The public shell includes:

- a keyboard-visible skip link
- semantic header, navigation, main, and footer regions
- labeled navigation
- readable status language
- responsive layouts
- non-image fallbacks for unapproved photography
- clear empty and error states

A formal accessibility acceptance review remains a launch gate.

## Remaining public-launch work

- Final logo, photography, colors, biography, privacy notice, terms, and accessibility contact approval
- Approved episode media, guest biography, transcript, chapters, resources, and platform URLs
- Content-management approval workflow for promoting private records into public collections
- Static rendering or server-side rendering for stronger search crawling at scale
- Social preview image generation
- Search, filters, pagination, and related-content recommendations
- Newsletter confirmation and preference management
- Final analytics and consent configuration
- Domain, TLS, staging, production, and executive launch approval
