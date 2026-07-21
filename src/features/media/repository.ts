import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { MediaAssetRecord, ReviewVersionRecord, TimecodedCommentRecord } from './types';

export interface MediaRepository {
  listAssets(): Promise<MediaAssetRecord[]>;
  listVersions(): Promise<ReviewVersionRecord[]>;
  listComments(): Promise<TimecodedCommentRecord[]>;
  saveAsset(record: MediaAssetRecord): Promise<void>;
  saveVersion(record: ReviewVersionRecord): Promise<void>;
  saveComment(record: TimecodedCommentRecord): Promise<void>;
}

const keys = {
  assets: 'majestic-muse-demo-media-assets',
  versions: 'majestic-muse-demo-review-versions',
  comments: 'majestic-muse-demo-review-comments',
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

class LocalMediaRepository implements MediaRepository {
  async listAssets() { return readLocal<MediaAssetRecord>(keys.assets); }
  async listVersions() { return readLocal<ReviewVersionRecord>(keys.versions); }
  async listComments() { return readLocal<TimecodedCommentRecord>(keys.comments); }
  async saveAsset(record: MediaAssetRecord) { upsertLocal(keys.assets, record); }
  async saveVersion(record: ReviewVersionRecord) { upsertLocal(keys.versions, record); }
  async saveComment(record: TimecodedCommentRecord) { upsertLocal(keys.comments, record); }
}

class FirestoreMediaRepository implements MediaRepository {
  async listAssets() {
    if (!db) return [];
    const snapshot = await getDocs(collection(db, 'mediaAssets'));
    return snapshot.docs.map(item => ({ id: item.id, ...item.data() }) as MediaAssetRecord);
  }
  async listVersions() {
    if (!db) return [];
    const snapshot = await getDocs(collection(db, 'reviewVersions'));
    return snapshot.docs.map(item => ({ id: item.id, ...item.data() }) as ReviewVersionRecord);
  }
  async listComments() {
    if (!db) return [];
    const snapshot = await getDocs(collection(db, 'reviewComments'));
    return snapshot.docs.map(item => ({ id: item.id, ...item.data() }) as TimecodedCommentRecord);
  }
  async saveAsset(record: MediaAssetRecord) {
    if (!db) throw new Error('Firestore is not configured.');
    await setDoc(doc(db, 'mediaAssets', record.id), record, { merge: true });
  }
  async saveVersion(record: ReviewVersionRecord) {
    if (!db) throw new Error('Firestore is not configured.');
    await setDoc(doc(db, 'reviewVersions', record.id), record, { merge: true });
  }
  async saveComment(record: TimecodedCommentRecord) {
    if (!db) throw new Error('Firestore is not configured.');
    await setDoc(doc(db, 'reviewComments', record.id), record, { merge: true });
  }
}

export function createMediaRepository(): MediaRepository {
  return db ? new FirestoreMediaRepository() : new LocalMediaRepository();
}
