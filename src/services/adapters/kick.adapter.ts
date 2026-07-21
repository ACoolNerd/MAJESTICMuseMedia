import type { AdapterStatus, BaseAdapter } from './base.adapter';

export class KickAdapter implements BaseAdapter {
  getStatus(): AdapterStatus {
    const isConnected = Boolean(import.meta.env.VITE_KICK_API_KEY);
    return {
      isConnected,
      platform: 'KICK',
      message: isConnected ? undefined : 'Connection Required — add VITE_KICK_API_KEY to .env',
    };
  }
}

export const kickAdapter = new KickAdapter();
