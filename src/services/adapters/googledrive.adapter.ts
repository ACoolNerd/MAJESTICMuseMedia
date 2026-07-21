import type { AdapterStatus, BaseAdapter } from './base.adapter';

export class GoogleDriveAdapter implements BaseAdapter {
  getStatus(): AdapterStatus {
    const isConnected = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);
    return {
      isConnected,
      platform: 'Google Drive',
      message: isConnected ? undefined : 'Connection Required — add VITE_GOOGLE_CLIENT_ID to .env',
    };
  }
}

export const googleDriveAdapter = new GoogleDriveAdapter();
