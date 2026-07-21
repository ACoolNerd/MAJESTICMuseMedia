import type { MediaAssetRecord, TimecodedCommentRecord } from '../media/types';
import type { EpisodeRecord, GuestRecord } from '../operations/types';
import type { DistributionJobRecord, PlatformConnectionRecord } from '../platforms/types';
import { sourceRegistry } from './seed';
import type { MuseAnswer, MuseCitation, SourceRecord } from './types';

export interface MuseState {
  episodes: EpisodeRecord[];
  guests: GuestRecord[];
  assets: MediaAssetRecord[];
  comments: TimecodedCommentRecord[];
  connections: PlatformConnectionRecord[];
  jobs: DistributionJobRecord[];
}

function citation(source: SourceRecord, recordId?: string): MuseCitation {
  return {
    sourceId: source.id,
    sourceTitle: source.title,
    recordId,
    status: source.status,
    observedAt: source.updatedAt,
  };
}

function source(id: string): SourceRecord {
  const record = sourceRegistry.find(item => item.id === id);
  if (!record) throw new Error(`Source ${id} is not registered.`);
  return record;
}

function baseAnswer(question: string): Omit<MuseAnswer, 'answer' | 'facts' | 'recommendations' | 'missingInformation' | 'confidence' | 'citations'> {
  return {
    id: crypto.randomUUID(),
    question,
    generatedAt: new Date().toISOString(),
    mode: 'Deterministic local',
    requiresApproval: true,
  };
}

export function askMuse(question: string, state: MuseState): MuseAnswer {
  const normalized = question.toLowerCase();
  const control = source('production-control-center');
  const operating = source('master-operating-source');

  if (normalized.includes('approval')) {
    const blockedEpisodes = state.episodes.filter(episode => episode.gates.some(gate => gate.status !== 'Passed' && gate.status !== 'Waived with Written Reason'));
    const facts = blockedEpisodes.map(episode => `${episode.code}: ${episode.gates.filter(gate => gate.status !== 'Passed' && gate.status !== 'Waived with Written Reason').map(gate => `${gate.name}=${gate.status}`).join(', ')}`);
    return {
      ...baseAnswer(question),
      answer: blockedEpisodes.length ? `${blockedEpisodes.length} episode(s) still have incomplete release gates.` : 'No incomplete release gates were found in the loaded episode records.',
      facts,
      recommendations: blockedEpisodes.map(episode => `Open ${episode.code} and assign the next action for each incomplete gate.`),
      missingInformation: blockedEpisodes.filter(episode => episode.status === 'Proposed' || episode.status === 'TBD').map(episode => `${episode.code} is not fully confirmed.`),
      confidence: blockedEpisodes.length ? 0.96 : 0.82,
      citations: [citation(control), citation(operating)],
    };
  }

  if (normalized.includes('guest') && (normalized.includes('missing') || normalized.includes('material'))) {
    const missing = state.guests.filter(guest => guest.bioStatus !== 'Approved' || guest.headshotStatus !== 'Approved' || (guest.releaseStatus !== 'Signed' && guest.releaseStatus !== 'Waived with Written Reason'));
    return {
      ...baseAnswer(question),
      answer: `${missing.length} guest record(s) have incomplete biography, headshot or release requirements.`,
      facts: missing.map(guest => `${guest.name}: bio ${guest.bioStatus}; headshot ${guest.headshotStatus}; release ${guest.releaseStatus}.`),
      recommendations: missing.map(guest => `Request or verify the missing materials for ${guest.name}.`),
      missingInformation: missing.filter(guest => guest.status === 'TBD').map(guest => `${guest.name}'s participation status remains TBD.`),
      confidence: 0.98,
      citations: [citation(control), citation(source('signed-guest-materials'))],
    };
  }

  if (normalized.includes('blocking') || normalized.includes('next release')) {
    const episode = [...state.episodes].sort((a, b) => (a.releaseDate ?? '9999').localeCompare(b.releaseDate ?? '9999'))[0];
    if (!episode) {
      return { ...baseAnswer(question), answer: 'No episode records are loaded.', facts: [], recommendations: ['Load or create the episode slate.'], missingInformation: ['Episode slate'], confidence: 1, citations: [citation(control)] };
    }
    const blockers = episode.gates.filter(gate => gate.status !== 'Passed' && gate.status !== 'Waived with Written Reason');
    const unresolved = state.comments.filter(comment => comment.episodeId === episode.id && !comment.resolved && comment.severity === 'Blocking');
    return {
      ...baseAnswer(question),
      answer: `${episode.code} is the nearest dated release. Its critical path contains ${blockers.length} incomplete gate(s) and ${unresolved.length} blocking review note(s).`,
      facts: [
        ...blockers.map(gate => `${gate.name} gate: ${gate.status}.`),
        ...unresolved.map(comment => `${comment.category} at ${comment.timeSeconds}s: ${comment.body}`),
      ],
      recommendations: ['Clear rights and technical blockers before scheduling distribution.', 'Do not change Proposed or TBD records without an authorized confirmation action.'],
      missingInformation: episode.location?.startsWith('TBD') ? ['Confirmed production location'] : [],
      confidence: 0.97,
      citations: [citation(control, episode.id), citation(operating, episode.id)],
    };
  }

  if (normalized.includes('final master') || normalized.includes('latest master')) {
    const masters = state.assets.filter(asset => asset.kind === 'Final Master').sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    return {
      ...baseAnswer(question),
      answer: masters.length ? `The latest recorded final master is ${masters[0].name}.` : 'No asset is currently labeled Final Master.',
      facts: masters.slice(0, 3).map(asset => `${asset.name}: ${asset.status}; checksum ${asset.checksum ? 'recorded' : 'missing'}; backup ${asset.backupVerified ? 'verified' : 'missing'}.`),
      recommendations: masters.length ? ['Validate checksum, backup, technical status and executive approval before publishing.'] : ['Brian should upload and validate the approved final master after edit completion.'],
      missingInformation: masters.length ? [] : ['Approved final-master record'],
      confidence: 0.99,
      citations: [citation(source('master-operating-workbook'))],
    };
  }

  if (normalized.includes('platform') || normalized.includes('connection')) {
    return {
      ...baseAnswer(question),
      answer: `${state.connections.filter(item => item.state === 'Connected').length} of ${state.connections.length} platform connection(s) are marked Connected.`,
      facts: state.connections.map(item => `${item.platform}: ${item.testMode ? 'Test mode' : item.state}; ${item.scopes.length} granted scope label(s).`),
      recommendations: state.connections.filter(item => item.state !== 'Connected').map(item => `Complete the approved server-side OAuth setup for ${item.platform}.`),
      missingInformation: state.connections.filter(item => item.state !== 'Connected').map(item => `${item.platform} verified account connection`),
      confidence: 1,
      citations: [citation(source('master-operating-workbook'))],
    };
  }

  if (normalized.includes('publish') || normalized.includes('distribution')) {
    const pending = state.jobs.filter(job => job.status !== 'Succeeded' && job.status !== 'Cancelled');
    return {
      ...baseAnswer(question),
      answer: `${pending.length} distribution job(s) remain unfinished.`,
      facts: pending.map(job => `${job.platform} ${job.action}: ${job.status}; attempts ${job.attempts}; external ID ${job.externalId ?? 'not returned'}.`),
      recommendations: pending.map(job => job.status === 'Approved' ? `Execute ${job.id} through the trusted server worker.` : `Move ${job.id} through review and CEO approval.`),
      missingInformation: pending.filter(job => !job.externalId).map(job => `${job.id} returned platform state`),
      confidence: 0.98,
      citations: [citation(control)],
    };
  }

  return {
    ...baseAnswer(question),
    answer: 'The current deterministic Muse engine could not map that question to an approved operational query.',
    facts: [],
    recommendations: ['Use one of the starter questions or send the question to the future trusted Gemini structured-output service.'],
    missingInformation: ['A supported query mapping or approved Gemini server response'],
    confidence: 0.35,
    citations: [citation(control), citation(operating)],
  };
}
