/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { db } from '../../lib/firebase';
import { createGrowthRepository } from './repository';
import { seedAnalytics, seedLeads, seedMoments } from './seed';
import type { AnalyticsSnapshot, LeadRecord, RepurposingMoment } from './types';

interface GrowthContextValue {
  analytics: AnalyticsSnapshot[];
  leads: LeadRecord[];
  moments: RepurposingMoment[];
  loading: boolean;
  error: string | null;
  persistenceMode: 'Firestore' | 'Local demo';
  saveAnalytics: (record: AnalyticsSnapshot) => Promise<void>;
  saveLead: (record: LeadRecord) => Promise<void>;
  saveMoment: (record: RepurposingMoment) => Promise<void>;
}

const GrowthContext = createContext<GrowthContextValue | undefined>(undefined);

export function GrowthProvider({ children }: { children: ReactNode }) {
  const repository = useMemo(() => createGrowthRepository(), []);
  const [analytics, setAnalytics] = useState<AnalyticsSnapshot[]>([]);
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [moments, setMoments] = useState<RepurposingMoment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [storedAnalytics, storedLeads, storedMoments] = await Promise.all([
          repository.listAnalytics(), repository.listLeads(), repository.listMoments(),
        ]);
        if (!active) return;
        setAnalytics(storedAnalytics.length ? storedAnalytics : seedAnalytics);
        setLeads(storedLeads.length ? storedLeads : seedLeads);
        setMoments(storedMoments.length ? storedMoments : seedMoments);
      } catch (caught) {
        if (!active) return;
        setAnalytics(seedAnalytics);
        setLeads(seedLeads);
        setMoments(seedMoments);
        setError(caught instanceof Error ? caught.message : 'Unable to load growth records.');
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, [repository]);

  const value = useMemo<GrowthContextValue>(() => ({
    analytics, leads, moments, loading, error,
    persistenceMode: db ? 'Firestore' : 'Local demo',
    saveAnalytics: async record => {
      await repository.saveAnalytics(record);
      setAnalytics(current => [...current.filter(item => item.id !== record.id), record]);
    },
    saveLead: async record => {
      const updated = { ...record, updatedAt: new Date().toISOString() };
      await repository.saveLead(updated);
      setLeads(current => [...current.filter(item => item.id !== updated.id), updated]);
    },
    saveMoment: async record => {
      await repository.saveMoment(record);
      setMoments(current => [...current.filter(item => item.id !== record.id), record]);
    },
  }), [analytics, error, leads, loading, moments, repository]);

  return <GrowthContext.Provider value={value}>{children}</GrowthContext.Provider>;
}

export function useGrowth(): GrowthContextValue {
  const value = useContext(GrowthContext);
  if (!value) throw new Error('useGrowth must be used within GrowthProvider.');
  return value;
}
