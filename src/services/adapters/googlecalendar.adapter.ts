import type { AdapterStatus, BaseAdapter } from './base.adapter';

export class GoogleCalendarAdapter implements BaseAdapter {
  getStatus(): AdapterStatus {
    const isConnected = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);
    return {
      isConnected,
      platform: 'Google Calendar',
      message: isConnected ? undefined : 'Connection Required — add VITE_GOOGLE_CLIENT_ID to .env',
    };
  }
}

export const googleCalendarAdapter = new GoogleCalendarAdapter();
