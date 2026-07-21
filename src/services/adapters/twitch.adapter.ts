import type { AdapterStatus, BaseAdapter } from './base.adapter';

export class TwitchAdapter implements BaseAdapter {
  getStatus(): AdapterStatus {
    const isConnected = Boolean(import.meta.env.VITE_TWITCH_CLIENT_ID);
    return {
      isConnected,
      platform: 'Twitch',
      message: isConnected ? undefined : 'Connection Required — add VITE_TWITCH_CLIENT_ID to .env',
    };
  }
}

export const twitchAdapter = new TwitchAdapter();
