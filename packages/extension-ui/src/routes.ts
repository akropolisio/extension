import build, { getParam } from 'build-route-tree';

const rawTree = {
  account: {
    create: null,
    forget: {
      address: getParam(null),
    },
    importSeed: null,
    importQr: null,
  },
  assets: {
    address: getParam({
      buy: null,
      send: null,
    }),
  },
  settings: null,
}

export const routes = build(rawTree);
