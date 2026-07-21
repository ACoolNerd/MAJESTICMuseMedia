import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { AnalyticsSnapshot, LeadRecord, RepurposingMoment } from './types';

export interface GrowthRepository {
  listAnalytics(): Promise<AnalyticsSnapshot[]>;
  listLeads(): Promise<LeadRecord[]>;
  listMoments(): Promise<RepurposingMoment[]>;
  saveAnalytics(record: AnalyticsSnapshot): Promise<void>;
  saveLead(record: LeadRecord): Promise<void>;
  saveMoment(record: RepurposingMoment): Promise<void>;
}

const keys = {
  analytics: 'majestic-muse-demo-analytics',
  leads: 'majestic-muse-demo-leads',
  moments: 'majestic-muse-demo-moments',
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
  const records = readLocal<T>(key);
  localStorage.setItem(key, JSON.stringify([...records.filter(item => item.id !== record.id), record]));
}

class LocalGrowthRepository implements GrowthRepository {
  async listAnalytics() { return readLocal<AnalyticsSnapshot>(keys.analytics); }
  async listLeads() { return readLocal<LeadRecord>(keys.leads); }
  async listMoments() { return readLocal<RepurposingMoment>(keys.moments); }
  async saveAnalytics(record: AnalyticsSnapshot) { upsertLocal(keys.analytics, record); }
  async saveLead(record: LeadRecord) { upsertLocal(keys.leads, record); }
  async saveMoment(record: RepurposingMoment) { upsertLocal(keys.moments, record); }
}

class FirestoreGrowthRepository implements GrowthRepository {
  async listAnalytics() {
    if (!db) return [];
    const snapshot = await getDocs(collection(db, 'analyticsSnapshots'));
    return snapshot.docs.map(item => ({ id: item.id, ...item.data() }) as AnalyticsSnapshot);
  }
  async listLeads() {
    if (!db) return [];
    const snapshot = await getDocs(collection(db, 'leads'));
    return snapshot.docs.map(item => ({ id: item.id, ...item.data() }) as LeadRecord);
  }
  async listMoments() {
    if (!db) return [];
    const snapshot = await getDocs(collection(db, 'repurposingMoments'));
    return snapshot.docs.map(item => ({ id: item.id, ...item.data() }) as RepurposingMoment);
  }
  async saveAnalytics(record: AnalyticsSnapshot) {
    if (!db) throw new Error('Firestore is not configured.');
    await setDoc(doc(db, 'analyticsSnapshots', record.id), record, { merge: true });
  }
  async saveLead(record: LeadRecord) {
    if (!db) throw new Error('Firestore is not configured.');
    await setDoc(doc(db, 'leads', record.id), record, { merge: true });
  }
  async saveMoment(record: RepurposingMoment) {
    if (!db) throw new Error('Firestore is not configured.');
    await setDoc(doc(db, 'repurposingMoments', record.id), record, { merge: true });
  }
}

export function createGrowthRepository(): GrowthRepository {
  return db ? new FirestoreGrowthRepository() : new LocalGrowthRepository();
}
