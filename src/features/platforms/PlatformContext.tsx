/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { db } from '../../lib/firebase';
import { createPlatformAdapter } from './adapters';
import { createPlatformRepository } from './repository';
import { seedDistributionJobs, seedLiveEvents, seedPlatformConnections } from './seed';
import type { AdapterHealth, DistributionJobRecord, LiveEventRecord, PlatformConnectionRecord, PlatformName } from './types';

interface PlatformContextValue {
  connections: PlatformConnectionRecord[];
  events: LiveEventRecord[];
  jobs: DistributionJobRecord[];
  loading: boolean;
  error: string | null;
  persistenceMode: 'Firestore' | 'Local demo';
  checkHealth: (platform: PlatformName) => Promise<AdapterHealth>;
  setTestMode: (platform: PlatformName, enabled: boolean) => Promise<void>;
  saveEvent: (event: LiveEventRecord) => Promise<void>;
  saveJob: (job: DistributionJobRecord) => Promise<void>;
}

const PlatformContext = createContext<PlatformContextValue | undefined>(undefined);

export function PlatformProvider({ children }: { children: ReactNode }) {
  const repository = useMemo(() => createPlatformRepository(), []);
  const [connections, setConnections] = useState<PlatformConnectionRecord[]>([]);
  const [events, setEvents] = useState<LiveEventRecord[]>([]);
  const [jobs, setJobs] = useState<DistributionJobRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [storedConnections, storedEvents, storedJobs] = await Promise.all([
          repository.listConnections(), repository.listEvents(), repository.listJobs(),
        ]);
        if (!active) return;
        setConnections(storedConnections.length ? storedConnections : seedPlatformConnections);
        setEvents(storedEvents.length ? storedEvents : seedLiveEvents);
        setJobs(storedJobs.length ? storedJobs : seedDistributionJobs);
      } catch (caught) {
        if (!active) return;
        setConnections(seedPlatformConnections);
        setEvents(seedLiveEvents);
        setJobs(seedDistributionJobs);
        setError(caught instanceof Error ? caught.message : 'Unable to load platform records.');
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, [repository]);

  const value = useMemo<PlatformContextValue>(() => ({
    connections, events, jobs, loading, error,
    persistenceMode: db ? 'Firestore' : 'Local demo',
    checkHealth: async platform => {
      const connection = connections.find(item => item.platform === platform);
      if (!connection) throw new Error(`${platform} connection record is missing.`);
      return createPlatformAdapter(platform).checkHealth(connection);
    },
    setTestMode: async (platform, enabled) => {
      const current = connections.find(item => item.platform === platform);
      if (!current) throw new Error(`${platform} connection record is missing.`);
      const updated: PlatformConnectionRecord = {
        ...current,
        testMode: enabled,
        lastCheckedAt: new Date().toISOString(),
      };
      await repository.saveConnection(updated);
      setConnections(records => records.map(item => item.platform === platform ? updated : item));
    },
    saveEvent: async event => {
      const updated = { ...event, updatedAt: new Date().toISOString() };
      await repository.saveEvent(updated);
      setEvents(records => [...records.filter(item => item.id !== updated.id), updated]);
    },
    saveJob: async job => {
      const updated = { ...job, updatedAt: new Date().toISOString() };
      await repository.saveJob(updated);
      setJobs(records => [...records.filter(item => item.id !== updated.id), updated]);
    },
  }), [connections, error, events, jobs, loading, repository]);

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
}

export function usePlatforms(): PlatformContextValue {
  const value = useContext(PlatformContext);
  if (!value) throw new Error('usePlatforms must be used within PlatformProvider.');
  return value;
}
