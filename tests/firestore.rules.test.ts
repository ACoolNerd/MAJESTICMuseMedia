import { readFile } from 'node:fs/promises';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

let environment: RulesTestEnvironment;

beforeAll(async () => {
  environment = await initializeTestEnvironment({
    projectId: 'demo-majestic-muse',
    firestore: {
      rules: await readFile('firestore.rules', 'utf8'),
      host: '127.0.0.1',
      port: 8080,
    },
  });

  await environment.withSecurityRulesDisabled(async context => {
    const db = context.firestore();
    await setDoc(doc(db, 'publicContent', 'home'), { title: 'Public home' });
    await setDoc(doc(db, 'episodes', 's01e01'), { title: 'IDENTITY', status: 'Scheduled' });
    await setDoc(doc(db, 'guestDocuments', 'rebecca-release'), { ownerUid: 'guest-1', status: 'Signed' });
    await setDoc(doc(db, 'auditLogs', 'audit-1'), { action: 'seed', createdAt: new Date().toISOString() });
    await setDoc(doc(db, 'platformCredentials', 'youtube-coo'), { encryptedRefreshToken: 'ciphertext' });
    await setDoc(doc(db, 'distributionJobs', 'job-1'), { status: 'Draft', requestedByUid: 'social-1', attempts: 0 });
  });
});

afterEach(async () => {
  await environment.clearFirestore();
  await environment.withSecurityRulesDisabled(async context => {
    const db = context.firestore();
    await setDoc(doc(db, 'publicContent', 'home'), { title: 'Public home' });
    await setDoc(doc(db, 'episodes', 's01e01'), { title: 'IDENTITY', status: 'Scheduled' });
    await setDoc(doc(db, 'guestDocuments', 'rebecca-release'), { ownerUid: 'guest-1', status: 'Signed' });
    await setDoc(doc(db, 'auditLogs', 'audit-1'), { action: 'seed', createdAt: new Date().toISOString() });
    await setDoc(doc(db, 'platformCredentials', 'youtube-coo'), { encryptedRefreshToken: 'ciphertext' });
    await setDoc(doc(db, 'distributionJobs', 'job-1'), { status: 'Draft', requestedByUid: 'social-1', attempts: 0 });
  });
});

afterAll(async () => {
  await environment.cleanup();
});

function authenticated(uid: string, role: string) {
  return environment.authenticatedContext(uid, { role }).firestore();
}

function unauthenticated() {
  return environment.unauthenticatedContext().firestore();
}

describe('public and staff records', () => {
  it('allows public reads only from the public content collection', async () => {
    await assertSucceeds(getDoc(doc(unauthenticated(), 'publicContent', 'home')));
    await assertFails(getDoc(doc(unauthenticated(), 'episodes', 's01e01')));
  });

  it('allows crew to read episodes but not edit them', async () => {
    const db = authenticated('crew-1', 'crew');
    await assertSucceeds(getDoc(doc(db, 'episodes', 's01e01')));
    await assertFails(updateDoc(doc(db, 'episodes', 's01e01'), { title: 'Unauthorized edit' }));
  });

  it('allows social operators to create episode records', async () => {
    const db = authenticated('social-1', 'social');
    await assertSucceeds(setDoc(doc(db, 'episodes', 's01e02'), { title: 'Proposed episode', status: 'Proposed' }));
  });
});

describe('guest isolation and trusted collections', () => {
  it('allows a guest owner to read their document but blocks other guests', async () => {
    await assertSucceeds(getDoc(doc(authenticated('guest-1', 'guest'), 'guestDocuments', 'rebecca-release')));
    await assertFails(getDoc(doc(authenticated('guest-2', 'guest'), 'guestDocuments', 'rebecca-release')));
  });

  it('denies every client write to audit logs', async () => {
    await assertFails(setDoc(doc(authenticated('ceo-1', 'ceo'), 'auditLogs', 'client-write'), { action: 'forbidden' }));
    await assertSucceeds(getDoc(doc(authenticated('ceo-1', 'ceo'), 'auditLogs', 'audit-1')));
  });

  it('keeps encrypted platform credentials invisible to every client role', async () => {
    for (const role of ['ceo', 'coo', 'post', 'social', 'crew']) {
      await assertFails(getDoc(doc(authenticated(`${role}-1`, role), 'platformCredentials', 'youtube-coo')));
    }
  });
});

describe('distribution authority', () => {
  it('allows social to create only a draft or waiting-approval job', async () => {
    const db = authenticated('social-1', 'social');
    await assertSucceeds(setDoc(doc(db, 'distributionJobs', 'draft-2'), { status: 'Draft', requestedByUid: 'social-1' }));
    await assertFails(setDoc(doc(db, 'distributionJobs', 'success-2'), { status: 'Succeeded', requestedByUid: 'social-1' }));
  });

  it('allows only the CEO to move a job into Approved', async () => {
    await assertFails(updateDoc(doc(authenticated('coo-1', 'coo'), 'distributionJobs', 'job-1'), { status: 'Approved' }));
    await assertSucceeds(updateDoc(doc(authenticated('ceo-1', 'ceo'), 'distributionJobs', 'job-1'), { status: 'Approved' }));
  });

  it('reserves processing and success states for the trusted server', async () => {
    const db = authenticated('ceo-1', 'ceo');
    await assertFails(updateDoc(doc(db, 'distributionJobs', 'job-1'), { status: 'Processing' }));
    await assertFails(updateDoc(doc(db, 'distributionJobs', 'job-1'), { status: 'Succeeded' }));
  });
});

describe('deny-by-default behavior', () => {
  it('blocks unregistered collections', async () => {
    const db = authenticated('ceo-1', 'ceo');
    await assertFails(setDoc(doc(db, 'unregisteredCollection', 'record-1'), { value: true }));
  });

  it('keeps anonymous form submissions write-only', async () => {
    const db = unauthenticated();
    await assertSucceeds(setDoc(doc(db, 'formSubmissions', 'submission-1'), { formType: 'newsletter', consent: true, status: 'New' }));
    await assertFails(getDoc(doc(db, 'formSubmissions', 'submission-1')));
    expect(true).toBe(true);
  });
});
