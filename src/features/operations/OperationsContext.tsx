/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { db } from '../../lib/firebase';
import { createOperationsRepository } from './repository';
import { seedEpisodes, seedGuests } from './seed';
import type { EpisodeRecord, FormSubmissionRecord, GuestRecord } from './types';

interface OperationsContextValue {
  episodes: EpisodeRecord[];
  guests: GuestRecord[];
  loading: boolean;
  error: string | null;
  persistenceMode: 'Firestore' | 'Local demo';
  saveEpisode: (record: EpisodeRecord) => Promise<void>;
  saveGuest: (record: GuestRecord) => Promise<void>;
  submitForm: (record: Omit<FormSubmissionRecord, 'id' | 'submittedAt' | 'status'>) => Promise<string>;
}

const OperationsContext = createContext<OperationsContextValue | undefined>(undefined);

export function OperationsProvider({ children }: { children: ReactNode }) {
  const repository = useMemo(() => createOperationsRepository(), []);
  const [episodes, setEpisodes] = useState<EpisodeRecord[]>([]);
  const [guests, setGuests] = useState<GuestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [storedEpisodes, storedGuests] = await Promise.all([
          repository.listEpisodes(),
          repository.listGuests(),
        ]);
        if (!active) return;
        setEpisodes(storedEpisodes.length ? storedEpisodes : seedEpisodes);
        setGuests(storedGuests.length ? storedGuests : seedGuests);
      } catch (caught) {
        if (!active) return;
        setEpisodes(seedEpisodes);
        setGuests(seedGuests);
        setError(caught instanceof Error ? caught.message : 'Unable to load operating records.');
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, [repository]);

  const value = useMemo<OperationsContextValue>(() => ({
    episodes,
    guests,
    loading,
    error,
    persistenceMode: db ? 'Firestore' : 'Local demo',
    saveEpisode: async record => {
      const updated = { ...record, updatedAt: new Date().toISOString() };
      await repository.saveEpisode(updated);
      setEpisodes(current => [...current.filter(item => item.id !== updated.id), updated].sort((a, b) => a.code.localeCompare(b.code)));
    },
    saveGuest: async record => {
      const updated = { ...record, updatedAt: new Date().toISOString() };
      await repository.saveGuest(updated);
      setGuests(current => [...current.filter(item => item.id !== updated.id), updated].sort((a, b) => a.name.localeCompare(b.name)));
    },
    submitForm: record => repository.submitForm(record),
  }), [episodes, error, guests, loading, repository]);

  return <OperationsContext.Provider value={value}>{children}</OperationsContext.Provider>;
}

export function useOperations(): OperationsContextValue {
  const value = useContext(OperationsContext);
  if (!value) throw new Error('useOperations must be used within OperationsProvider.');
  return value;
}
