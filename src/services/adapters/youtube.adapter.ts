import type { AdapterStatus, BaseAdapter } from './base.adapter';

export class YouTubeAdapter implements BaseAdapter {
  getStatus(): AdapterStatus {
    const isConnected = Boolean(import.meta.env.VITE_YOUTUBE_API_KEY && import.meta.env.VITE_YOUTUBE_CHANNEL_ID);
    return {
      isConnected,
      platform: 'YouTube',
      message: isConnected ? undefined : 'Connection Required — add VITE_YOUTUBE_API_KEY and VITE_YOUTUBE_CHANNEL_ID to .env',
    };
  }
}

export const youtubeAdapter = new YouTubeAdapter();
