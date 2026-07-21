/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { db } from '../../lib/firebase';
import { createPublicContentRepository } from './repository';
import { seedPublicArticles, seedPublicClips, seedPublicEpisodes, seedPublicGuests, seedPublicLive } from './seed';
import type { PublicArticleRecord, PublicClipRecord, PublicEpisodeRecord, PublicGuestRecord, PublicLiveRecord } from './types';

interface PublicContentContextValue {
  episodes: PublicEpisodeRecord[];
  guests: PublicGuestRecord[];
  clips: PublicClipRecord[];
  articles: PublicArticleRecord[];
  live: PublicLiveRecord;
  loading: boolean;
  error: string | null;
  sourceMode: 'Firestore public content' | 'Approved static fallback';
}

const PublicContentContext = createContext<PublicContentContextValue | undefined>(undefined);

export function PublicContentProvider({ children }: { children: ReactNode }) {
  const repository = useMemo(() => createPublicContentRepository(), []);
  const [episodes, setEpisodes] = useState<PublicEpisodeRecord[]>(seedPublicEpisodes);
  const [guests, setGuests] = useState<PublicGuestRecord[]>(seedPublicGuests);
  const [clips, setClips] = useState<PublicClipRecord[]>(seedPublicClips);
  const [articles, setArticles] = useState<PublicArticleRecord[]>(seedPublicArticles);
  const [live, setLive] = useState<PublicLiveRecord>(seedPublicLive);
  const [loading, setLoading] = useState(Boolean(db));
  const [error, setError] = useState<string | null>(null);
  const [usingFirestore, setUsingFirestore] = useState(false);

  useEffect(() => {
    if (!db) return;
    let active = true;
    async function load() {
      try {
        const [storedEpisodes, storedGuests, storedClips, storedArticles, storedLive] = await Promise.all([
          repository.listEpisodes(), repository.listGuests(), repository.listClips(), repository.listArticles(), repository.getLive(),
        ]);
        if (!active) return;
        if (storedEpisodes.length) setEpisodes(storedEpisodes.filter(item => item.status !== 'Archived'));
        if (storedGuests.length) setGuests(storedGuests);
        if (storedClips.length) setClips(storedClips.filter(item => item.status === 'Published'));
        if (storedArticles.length) setArticles(storedArticles.filter(item => item.status === 'Published'));
        if (storedLive) setLive(storedLive);
        setUsingFirestore(Boolean(storedEpisodes.length || storedGuests.length || storedClips.length || storedArticles.length || storedLive));
      } catch (caught) {
        if (!active) return;
        setError(caught instanceof Error ? caught.message : 'Unable to load approved public content.');
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, [repository]);

  const value = useMemo<PublicContentContextValue>(() => ({
    episodes, guests, clips, articles, live, loading, error,
    sourceMode: usingFirestore ? 'Firestore public content' : 'Approved static fallback',
  }), [articles, clips, episodes, error, guests, live, loading, usingFirestore]);

  return <PublicContentContext.Provider value={value}>{children}</PublicContentContext.Provider>;
}

export function usePublicContent(): PublicContentContextValue {
  const value = useContext(PublicContentContext);
  if (!value) throw new Error('usePublicContent must be used within PublicContentProvider.');
  return value;
}
