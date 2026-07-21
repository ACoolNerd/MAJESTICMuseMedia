/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { db } from '../../lib/firebase';
import { createOperationsRepository } from './repository';
import {
  seedApprovals,
  seedCalendarItems,
  seedEpisodes,
  seedGuests,
  seedRasci,
  seedRights,
  seedTasks,
} from './seed';
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

interface OperationsContextValue {
  episodes: EpisodeRecord[];
  guests: GuestRecord[];
  tasks: TaskRecord[];
  approvals: ApprovalRecord[];
  rights: RightsRecord[];
  calendarItems: CalendarItemRecord[];
  rasci: RasciWorkstreamRecord[];
  loading: boolean;
  error: string | null;
  persistenceMode: 'Firestore' | 'Local demo';
  saveEpisode: (record: EpisodeRecord) => Promise<void>;
  saveGuest: (record: GuestRecord) => Promise<void>;
  saveTask: (record: TaskRecord) => Promise<void>;
  saveApproval: (record: ApprovalRecord) => Promise<void>;
  saveRights: (record: RightsRecord) => Promise<void>;
  saveCalendarItem: (record: CalendarItemRecord) => Promise<void>;
  saveRasci: (record: RasciWorkstreamRecord) => Promise<void>;
  submitForm: (record: Omit<FormSubmissionRecord, 'id' | 'submittedAt' | 'status'>) => Promise<string>;
}

const OperationsContext = createContext<OperationsContextValue | undefined>(undefined);

export function OperationsProvider({ children }: { children: ReactNode }) {
  const repository = useMemo(() => createOperationsRepository(), []);
  const [episodes, setEpisodes] = useState<EpisodeRecord[]>([]);
  const [guests, setGuests] = useState<GuestRecord[]>([]);
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [approvals, setApprovals] = useState<ApprovalRecord[]>([]);
  const [rights, setRights] = useState<RightsRecord[]>([]);
  const [calendarItems, setCalendarItems] = useState<CalendarItemRecord[]>([]);
  const [rasci, setRasci] = useState<RasciWorkstreamRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [storedEpisodes, storedGuests, storedTasks, storedApprovals, storedRights, storedCalendar, storedRasci] = await Promise.all([
          repository.listEpisodes(), repository.listGuests(), repository.listTasks(), repository.listApprovals(),
          repository.listRights(), repository.listCalendarItems(), repository.listRasci(),
        ]);
        if (!active) return;
        setEpisodes(storedEpisodes.length ? storedEpisodes : seedEpisodes);
        setGuests(storedGuests.length ? storedGuests : seedGuests);
        setTasks(storedTasks.length ? storedTasks : seedTasks);
        setApprovals(storedApprovals.length ? storedApprovals : seedApprovals);
        setRights(storedRights.length ? storedRights : seedRights);
        setCalendarItems(storedCalendar.length ? storedCalendar : seedCalendarItems);
        setRasci(storedRasci.length ? storedRasci : seedRasci);
      } catch (caught) {
        if (!active) return;
        setEpisodes(seedEpisodes);
        setGuests(seedGuests);
        setTasks(seedTasks);
        setApprovals(seedApprovals);
        setRights(seedRights);
        setCalendarItems(seedCalendarItems);
        setRasci(seedRasci);
        setError(caught instanceof Error ? caught.message : 'Unable to load operating records.');
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, [repository]);

  const value = useMemo<OperationsContextValue>(() => ({
    episodes, guests, tasks, approvals, rights, calendarItems, rasci, loading, error,
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
    saveTask: async record => {
      const updated = { ...record, updatedAt: new Date().toISOString() };
      await repository.saveTask(updated);
      setTasks(current => [...current.filter(item => item.id !== updated.id), updated].sort((a, b) => (a.dueDate ?? '9999').localeCompare(b.dueDate ?? '9999')));
    },
    saveApproval: async record => {
      const updated = { ...record, updatedAt: new Date().toISOString() };
      await repository.saveApproval(updated);
      setApprovals(current => [...current.filter(item => item.id !== updated.id), updated]);
    },
    saveRights: async record => {
      const updated = { ...record, updatedAt: new Date().toISOString() };
      await repository.saveRights(updated);
      setRights(current => [...current.filter(item => item.id !== updated.id), updated]);
    },
    saveCalendarItem: async record => {
      const updated = { ...record, updatedAt: new Date().toISOString() };
      await repository.saveCalendarItem(updated);
      setCalendarItems(current => [...current.filter(item => item.id !== updated.id), updated].sort((a, b) => a.startAt.localeCompare(b.startAt)));
    },
    saveRasci: async record => {
      const updated = { ...record, updatedAt: new Date().toISOString() };
      await repository.saveRasci(updated);
      setRasci(current => [...current.filter(item => item.id !== updated.id), updated].sort((a, b) => a.workstream.localeCompare(b.workstream)));
    },
    submitForm: record => repository.submitForm(record),
  }), [approvals, calendarItems, episodes, error, guests, loading, rasci, repository, rights, tasks]);

  return <OperationsContext.Provider value={value}>{children}</OperationsContext.Provider>;
}

export function useOperations(): OperationsContextValue {
  const value = useContext(OperationsContext);
  if (!value) throw new Error('useOperations must be used within OperationsProvider.');
  return value;
}
