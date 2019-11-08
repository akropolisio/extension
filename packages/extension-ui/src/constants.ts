import settings from '@polkadot/ui-settings';

export const akroNodes = [{
  text: 'Akropolis (Node 1)',
  value: 'wss://node1-chain.akropolis.io'
}, {
  text: 'Akropolis (Node 2)',
  value: 'wss://node2-chain.akropolis.io'
}, {
  text: 'Akro DAI Bridge',
  value: 'wss://node1-polkadai.akropolis.io'
}];

export const STORAGE_KEYS = {
  isOverriddenApiUrl: 'akro-is-overridden-api-url'
};

export const availableNodes = [...akroNodes, ...settings.availableNodes];
