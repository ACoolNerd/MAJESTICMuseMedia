import {
  addDoc,
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { EpisodeRecord, FormSubmissionRecord, GuestRecord } from './types';

export interface OperationsRepository {
  listEpisodes(): Promise<EpisodeRecord[]>;
  listGuests(): Promise<GuestRecord[]>;
  saveEpisode(record: EpisodeRecord): Promise<void>;
  saveGuest(record: GuestRecord): Promise<void>;
  submitForm(record: Omit<FormSubmissionRecord, 'id' | 'submittedAt' | 'status'>): Promise<string>;
}

const EPISODE_KEY = 'majestic-muse-demo-episodes';
const GUEST_KEY = 'majestic-muse-demo-guests';
const SUBMISSION_KEY = 'majestic-muse-demo-submissions';

function readLocal<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T[] : [];
  } catch {
    return [];
  }
}

function writeLocal<T>(key: string, records: T[]): void {
  localStorage.setItem(key, JSON.stringify(records));
}

class LocalOperationsRepository implements OperationsRepository {
  async listEpisodes() { return readLocal<EpisodeRecord>(EPISODE_KEY); }
  async listGuests() { return readLocal<GuestRecord>(GUEST_KEY); }

  async saveEpisode(record: EpisodeRecord) {
    const records = readLocal<EpisodeRecord>(EPISODE_KEY);
    writeLocal(EPISODE_KEY, [...records.filter(item => item.id !== record.id), record]);
  }

  async saveGuest(record: GuestRecord) {
    const records = readLocal<GuestRecord>(GUEST_KEY);
    writeLocal(GUEST_KEY, [...records.filter(item => item.id !== record.id), record]);
  }

  async submitForm(record: Omit<FormSubmissionRecord, 'id' | 'submittedAt' | 'status'>) {
    const id = crypto.randomUUID();
    const fullRecord: FormSubmissionRecord = {
      ...record,
      id,
      submittedAt: new Date().toISOString(),
      status: 'New',
    };
    writeLocal(SUBMISSION_KEY, [...readLocal<FormSubmissionRecord>(SUBMISSION_KEY), fullRecord]);
    return id;
  }
}

class FirestoreOperationsRepository implements OperationsRepository {
  async listEpisodes() {
    if (!db) return [];
    const snapshot = await getDocs(collection(db, 'episodes'));
    return snapshot.docs.map(item => ({ id: item.id, ...item.data() }) as EpisodeRecord);
  }

  async listGuests() {
    if (!db) return [];
    const snapshot = await getDocs(collection(db, 'guests'));
    return snapshot.docs.map(item => ({ id: item.id, ...item.data() }) as GuestRecord);
  }

  async saveEpisode(record: EpisodeRecord) {
    if (!db) throw new Error('Firestore is not configured.');
    await setDoc(doc(db, 'episodes', record.id), record, { merge: true });
  }

  async saveGuest(record: GuestRecord) {
    if (!db) throw new Error('Firestore is not configured.');
    await setDoc(doc(db, 'guests', record.id), record, { merge: true });
  }

  async submitForm(record: Omit<FormSubmissionRecord, 'id' | 'submittedAt' | 'status'>) {
    if (!db) throw new Error('Firestore is not configured.');
    const created = await addDoc(collection(db, 'formSubmissions'), {
      ...record,
      status: 'New',
      submittedAt: serverTimestamp(),
    });
    return created.id;
  }
}

export function createOperationsRepository(): OperationsRepository {
  return db ? new FirestoreOperationsRepository() : new LocalOperationsRepository();
}
