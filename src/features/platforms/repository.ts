import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { DistributionJobRecord, LiveEventRecord, PlatformConnectionRecord } from './types';

export interface PlatformRepository {
  listConnections(): Promise<PlatformConnectionRecord[]>;
  listEvents(): Promise<LiveEventRecord[]>;
  listJobs(): Promise<DistributionJobRecord[]>;
  saveConnection(record: PlatformConnectionRecord): Promise<void>;
  saveEvent(record: LiveEventRecord): Promise<void>;
  saveJob(record: DistributionJobRecord): Promise<void>;
}

const keys = {
  connections: 'majestic-muse-demo-platform-connections',
  events: 'majestic-muse-demo-live-events',
  jobs: 'majestic-muse-demo-distribution-jobs',
};

function readLocal<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T[] : [];
  } catch {
    return [];
  }
}

function upsertLocal<T extends { id: string }>(key: string, record: T) {
  const current = readLocal<T>(key);
  localStorage.setItem(key, JSON.stringify([...current.filter(item => item.id !== record.id), record]));
}

class LocalPlatformRepository implements PlatformRepository {
  async listConnections() { return readLocal<PlatformConnectionRecord>(keys.connections); }
  async listEvents() { return readLocal<LiveEventRecord>(keys.events); }
  async listJobs() { return readLocal<DistributionJobRecord>(keys.jobs); }
  async saveConnection(record: PlatformConnectionRecord) { upsertLocal(keys.connections, record); }
  async saveEvent(record: LiveEventRecord) { upsertLocal(keys.events, record); }
  async saveJob(record: DistributionJobRecord) { upsertLocal(keys.jobs, record); }
}

class FirestorePlatformRepository implements PlatformRepository {
  async listConnections() {
    if (!db) return [];
    const snapshot = await getDocs(collection(db, 'platformConnections'));
    return snapshot.docs.map(item => ({ id: item.id, ...item.data() }) as PlatformConnectionRecord);
  }
  async listEvents() {
    if (!db) return [];
    const snapshot = await getDocs(collection(db, 'liveEvents'));
    return snapshot.docs.map(item => ({ id: item.id, ...item.data() }) as LiveEventRecord);
  }
  async listJobs() {
    if (!db) return [];
    const snapshot = await getDocs(collection(db, 'distributionJobs'));
    return snapshot.docs.map(item => ({ id: item.id, ...item.data() }) as DistributionJobRecord);
  }
  async saveConnection(record: PlatformConnectionRecord) {
    if (!db) throw new Error('Firestore is not configured.');
    await setDoc(doc(db, 'platformConnections', record.id), record, { merge: true });
  }
  async saveEvent(record: LiveEventRecord) {
    if (!db) throw new Error('Firestore is not configured.');
    await setDoc(doc(db, 'liveEvents', record.id), record, { merge: true });
  }
  async saveJob(record: DistributionJobRecord) {
    if (!db) throw new Error('Firestore is not configured.');
    await setDoc(doc(db, 'distributionJobs', record.id), record, { merge: true });
  }
}

export function createPlatformRepository(): PlatformRepository {
  return db ? new FirestorePlatformRepository() : new LocalPlatformRepository();
}
