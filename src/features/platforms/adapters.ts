import type {
  AdapterHealth,
  CreateLiveEventInput,
  CreateLiveEventResult,
  PlatformAdapter,
  PlatformCapabilities,
  PlatformConnectionRecord,
  PlatformName,
} from './types';

export const platformCapabilities: Record<PlatformName, PlatformCapabilities> = {
  YouTube: {
    canSchedule: true,
    canCreateLiveEvent: true,
    canBindStream: true,
    canTransitionLiveState: true,
    canReadComments: true,
    canReplyToComments: true,
    canReadLiveChat: true,
    canSendLiveChat: true,
    canModerateChat: true,
    canUploadVideo: true,
    canReadAnalytics: true,
    canEmbedPlayer: true,
  },
  Twitch: {
    canSchedule: true,
    canCreateLiveEvent: false,
    canBindStream: false,
    canTransitionLiveState: false,
    canReadComments: false,
    canReplyToComments: false,
    canReadLiveChat: true,
    canSendLiveChat: true,
    canModerateChat: true,
    canUploadVideo: false,
    canReadAnalytics: true,
    canEmbedPlayer: true,
  },
  KICK: {
    canSchedule: false,
    canCreateLiveEvent: false,
    canBindStream: false,
    canTransitionLiveState: false,
    canReadComments: false,
    canReplyToComments: false,
    canReadLiveChat: true,
    canSendLiveChat: true,
    canModerateChat: false,
    canUploadVideo: false,
    canReadAnalytics: false,
    canEmbedPlayer: true,
  },
};

function connectionGuard(connection: PlatformConnectionRecord, required: keyof PlatformCapabilities) {
  if (connection.state !== 'Connected' && !connection.testMode) {
    throw new Error(`${connection.platform} connection required.`);
  }
  if (!connection.capabilities[required]) {
    throw new Error(`${connection.platform} does not expose ${required} in this adapter.`);
  }
}

class MockPlatformAdapter implements PlatformAdapter {
  readonly platform: PlatformName;
  readonly capabilities: PlatformCapabilities;

  constructor(platform: PlatformName) {
    this.platform = platform;
    this.capabilities = platformCapabilities[platform];
  }

  async checkHealth(connection: PlatformConnectionRecord): Promise<AdapterHealth> {
    return {
      platform: this.platform,
      state: connection.testMode ? 'Connected' : connection.state,
      checkedAt: new Date().toISOString(),
      message: connection.testMode ? 'Test adapter response. No external request was sent.' : connection.lastError ?? 'Connection state loaded.',
      capabilities: this.capabilities,
    };
  }

  async createLiveEvent(connection: PlatformConnectionRecord, input: CreateLiveEventInput): Promise<CreateLiveEventResult> {
    connectionGuard(connection, 'canCreateLiveEvent');
    if (!connection.testMode) {
      throw new Error('Production platform actions must be executed by the trusted server adapter.');
    }
    return {
      externalEventId: `test-${this.platform.toLowerCase()}-${crypto.randomUUID()}`,
      externalStreamId: this.capabilities.canBindStream ? `test-stream-${crypto.randomUUID()}` : undefined,
      publicUrl: undefined,
      returnedState: `test-created:${input.privacy}`,
    };
  }
}

export function createPlatformAdapter(platform: PlatformName): PlatformAdapter {
  return new MockPlatformAdapter(platform);
}

export function actionAvailability(capabilities: PlatformCapabilities): string[] {
  const labels: Array<[keyof PlatformCapabilities, string]> = [
    ['canSchedule', 'Schedule'],
    ['canCreateLiveEvent', 'Create live event'],
    ['canBindStream', 'Bind stream'],
    ['canTransitionLiveState', 'Transition live state'],
    ['canReadComments', 'Read comments'],
    ['canReplyToComments', 'Reply to comments'],
    ['canReadLiveChat', 'Read live chat'],
    ['canSendLiveChat', 'Send live chat'],
    ['canModerateChat', 'Moderate chat'],
    ['canUploadVideo', 'Upload video'],
    ['canReadAnalytics', 'Read analytics'],
    ['canEmbedPlayer', 'Embed player'],
  ];
  return labels.filter(([key]) => capabilities[key]).map(([, label]) => label);
}
