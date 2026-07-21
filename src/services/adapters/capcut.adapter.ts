import type { AdapterStatus, BaseAdapter } from './base.adapter';

export class CapCutAdapter implements BaseAdapter {
  getStatus(): AdapterStatus {
    return {
      isConnected: false,
      platform: 'CapCut',
      message: 'CapCut uses a manual handoff workflow. Export project files from Media Library and import into CapCut manually.',
    };
  }
}

export const capCutAdapter = new CapCutAdapter();
