import build, { getParam } from 'build-route-tree';

const rawTree = {
  account: {
    create: null,
    forget: {
      address: getParam(null),
    },
    import: null,
  },
  assets: {
    address: getParam(null),
  },
  settings: null,
}

export const routes = build(rawTree);
