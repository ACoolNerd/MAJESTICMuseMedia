import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { PublicArticleRecord, PublicClipRecord, PublicEpisodeRecord, PublicGuestRecord, PublicLiveRecord } from './types';

export interface PublicContentRepository {
  listEpisodes(): Promise<PublicEpisodeRecord[]>;
  listGuests(): Promise<PublicGuestRecord[]>;
  listClips(): Promise<PublicClipRecord[]>;
  listArticles(): Promise<PublicArticleRecord[]>;
  getLive(): Promise<PublicLiveRecord | null>;
}

async function listNestedCollection<T extends { id: string }>(name: string): Promise<T[]> {
  if (!db) return [];
  const snapshot = await getDocs(collection(db, 'publicContent', name, 'items'));
  return snapshot.docs.map(item => ({ id: item.id, ...item.data() }) as T);
}

class PublicFirestoreRepository implements PublicContentRepository {
  listEpisodes() { return listNestedCollection<PublicEpisodeRecord>('episodes'); }
  listGuests() { return listNestedCollection<PublicGuestRecord>('guests'); }
  listClips() { return listNestedCollection<PublicClipRecord>('clips'); }
  listArticles() { return listNestedCollection<PublicArticleRecord>('articles'); }
  async getLive() {
    const records = await listNestedCollection<PublicLiveRecord>('live');
    return records[0] ?? null;
  }
}

class EmptyPublicRepository implements PublicContentRepository {
  async listEpisodes() { return []; }
  async listGuests() { return []; }
  async listClips() { return []; }
  async listArticles() { return []; }
  async getLive() { return null; }
}

export function createPublicContentRepository(): PublicContentRepository {
  return db ? new PublicFirestoreRepository() : new EmptyPublicRepository();
}
