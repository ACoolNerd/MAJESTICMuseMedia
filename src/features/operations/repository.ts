import {
  addDoc,
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type {
  ApprovalRecord,
  CalendarItemRecord,
  EpisodeRecord,
  FormSubmissionRecord,
  GuestRecord,
  RasciWorkstreamRecord,
  RightsRecord,
  TaskRecord,
} from './types';

export interface OperationsRepository {
  listEpisodes(): Promise<EpisodeRecord[]>;
  listGuests(): Promise<GuestRecord[]>;
  listTasks(): Promise<TaskRecord[]>;
  listApprovals(): Promise<ApprovalRecord[]>;
  listRights(): Promise<RightsRecord[]>;
  listCalendarItems(): Promise<CalendarItemRecord[]>;
  listRasci(): Promise<RasciWorkstreamRecord[]>;
  saveEpisode(record: EpisodeRecord): Promise<void>;
  saveGuest(record: GuestRecord): Promise<void>;
  saveTask(record: TaskRecord): Promise<void>;
  saveApproval(record: ApprovalRecord): Promise<void>;
  saveRights(record: RightsRecord): Promise<void>;
  saveCalendarItem(record: CalendarItemRecord): Promise<void>;
  saveRasci(record: RasciWorkstreamRecord): Promise<void>;
  submitForm(record: Omit<FormSubmissionRecord, 'id' | 'submittedAt' | 'status'>): Promise<string>;
}

const keys = {
  episodes: 'majestic-muse-demo-episodes',
  guests: 'majestic-muse-demo-guests',
  tasks: 'majestic-muse-demo-tasks',
  approvals: 'majestic-muse-demo-approvals',
  rights: 'majestic-muse-demo-rights',
  calendar: 'majestic-muse-demo-calendar',
  rasci: 'majestic-muse-demo-rasci',
  submissions: 'majestic-muse-demo-submissions',
};

function readLocal<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T[] : [];
  } catch {
    return [];
  }
}

function upsertLocal<T extends { id: string }>(key: string, record: T): void {
  const records = readLocal<T>(key);
  localStorage.setItem(key, JSON.stringify([...records.filter(item => item.id !== record.id), record]));
}

class LocalOperationsRepository implements OperationsRepository {
  async listEpisodes() { return readLocal<EpisodeRecord>(keys.episodes); }
  async listGuests() { return readLocal<GuestRecord>(keys.guests); }
  async listTasks() { return readLocal<TaskRecord>(keys.tasks); }
  async listApprovals() { return readLocal<ApprovalRecord>(keys.approvals); }
  async listRights() { return readLocal<RightsRecord>(keys.rights); }
  async listCalendarItems() { return readLocal<CalendarItemRecord>(keys.calendar); }
  async listRasci() { return readLocal<RasciWorkstreamRecord>(keys.rasci); }
  async saveEpisode(record: EpisodeRecord) { upsertLocal(keys.episodes, record); }
  async saveGuest(record: GuestRecord) { upsertLocal(keys.guests, record); }
  async saveTask(record: TaskRecord) { upsertLocal(keys.tasks, record); }
  async saveApproval(record: ApprovalRecord) { upsertLocal(keys.approvals, record); }
  async saveRights(record: RightsRecord) { upsertLocal(keys.rights, record); }
  async saveCalendarItem(record: CalendarItemRecord) { upsertLocal(keys.calendar, record); }
  async saveRasci(record: RasciWorkstreamRecord) { upsertLocal(keys.rasci, record); }

  async submitForm(record: Omit<FormSubmissionRecord, 'id' | 'submittedAt' | 'status'>) {
    const id = crypto.randomUUID();
    const fullRecord: FormSubmissionRecord = {
      ...record,
      id,
      submittedAt: new Date().toISOString(),
      status: 'New',
    };
    upsertLocal(keys.submissions, fullRecord);
    return id;
  }
}

async function listCollection<T extends { id: string }>(name: string): Promise<T[]> {
  if (!db) return [];
  const snapshot = await getDocs(collection(db, name));
  return snapshot.docs.map(item => ({ id: item.id, ...item.data() }) as T);
}

async function saveCollectionRecord<T extends { id: string }>(name: string, record: T): Promise<void> {
  if (!db) throw new Error('Firestore is not configured.');
  await setDoc(doc(db, name, record.id), record, { merge: true });
}

class FirestoreOperationsRepository implements OperationsRepository {
  listEpisodes() { return listCollection<EpisodeRecord>('episodes'); }
  listGuests() { return listCollection<GuestRecord>('guests'); }
  listTasks() { return listCollection<TaskRecord>('tasks'); }
  listApprovals() { return listCollection<ApprovalRecord>('approvals'); }
  listRights() { return listCollection<RightsRecord>('rightsRecords'); }
  listCalendarItems() { return listCollection<CalendarItemRecord>('calendarItems'); }
  listRasci() { return listCollection<RasciWorkstreamRecord>('rasciWorkstreams'); }
  saveEpisode(record: EpisodeRecord) { return saveCollectionRecord('episodes', record); }
  saveGuest(record: GuestRecord) { return saveCollectionRecord('guests', record); }
  saveTask(record: TaskRecord) { return saveCollectionRecord('tasks', record); }
  saveApproval(record: ApprovalRecord) { return saveCollectionRecord('approvals', record); }
  saveRights(record: RightsRecord) { return saveCollectionRecord('rightsRecords', record); }
  saveCalendarItem(record: CalendarItemRecord) { return saveCollectionRecord('calendarItems', record); }
  saveRasci(record: RasciWorkstreamRecord) { return saveCollectionRecord('rasciWorkstreams', record); }

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
