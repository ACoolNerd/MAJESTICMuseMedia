/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { db } from '../../lib/firebase';
import { createMediaRepository } from './repository';
import { seedMediaAssets, seedReviewComments, seedReviewVersions } from './seed';
import type { MediaAssetRecord, ReviewVersionRecord, TimecodedCommentRecord } from './types';

interface MediaContextValue {
  assets: MediaAssetRecord[];
  versions: ReviewVersionRecord[];
  comments: TimecodedCommentRecord[];
  loading: boolean;
  error: string | null;
  persistenceMode: 'Firestore' | 'Local demo';
  saveAsset: (record: MediaAssetRecord) => Promise<void>;
  saveVersion: (record: ReviewVersionRecord) => Promise<void>;
  saveComment: (record: TimecodedCommentRecord) => Promise<void>;
}

const MediaContext = createContext<MediaContextValue | undefined>(undefined);

export function MediaProvider({ children }: { children: ReactNode }) {
  const repository = useMemo(() => createMediaRepository(), []);
  const [assets, setAssets] = useState<MediaAssetRecord[]>([]);
  const [versions, setVersions] = useState<ReviewVersionRecord[]>([]);
  const [comments, setComments] = useState<TimecodedCommentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [storedAssets, storedVersions, storedComments] = await Promise.all([
          repository.listAssets(), repository.listVersions(), repository.listComments(),
        ]);
        if (!active) return;
        setAssets(storedAssets.length ? storedAssets : seedMediaAssets);
        setVersions(storedVersions.length ? storedVersions : seedReviewVersions);
        setComments(storedComments.length ? storedComments : seedReviewComments);
      } catch (caught) {
        if (!active) return;
        setAssets(seedMediaAssets);
        setVersions(seedReviewVersions);
        setComments(seedReviewComments);
        setError(caught instanceof Error ? caught.message : 'Unable to load media records.');
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, [repository]);

  const value = useMemo<MediaContextValue>(() => ({
    assets, versions, comments, loading, error,
    persistenceMode: db ? 'Firestore' : 'Local demo',
    saveAsset: async record => {
      const updated = { ...record, updatedAt: new Date().toISOString() };
      await repository.saveAsset(updated);
      setAssets(current => [...current.filter(item => item.id !== updated.id), updated]);
    },
    saveVersion: async record => {
      await repository.saveVersion(record);
      setVersions(current => [...current.filter(item => item.id !== record.id), record]);
    },
    saveComment: async record => {
      await repository.saveComment(record);
      setComments(current => [...current.filter(item => item.id !== record.id), record].sort((a, b) => a.timeSeconds - b.timeSeconds));
    },
  }), [assets, comments, error, loading, repository, versions]);

  return <MediaContext.Provider value={value}>{children}</MediaContext.Provider>;
}

export function useMedia(): MediaContextValue {
  const value = useContext(MediaContext);
  if (!value) throw new Error('useMedia must be used within MediaProvider.');
  return value;
}
