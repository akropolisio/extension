import uiSettings from '@polkadot/ui-settings';
import store from 'store';

import { akroNodes, STORAGE_KEYS } from '../constants';

export function overrideDefaultSettings (): void {
  const isOverriddenApiUrl: boolean = store.get(STORAGE_KEYS.isOverriddenApiUrl, false);

  if (!isOverriddenApiUrl) {
    const settings = uiSettings.get();
    uiSettings.set({ ...settings, apiUrl: akroNodes[0].value });
    store.set(STORAGE_KEYS.isOverriddenApiUrl, true);
  }
}
