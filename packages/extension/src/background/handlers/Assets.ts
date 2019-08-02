// Copyright 2019 @polkadot/extension authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise, WsProvider } from '@polkadot/api';
import { createType, Vec } from '@polkadot/types';
import { Balance, BalanceLock } from '@polkadot/types/interfaces';
import settings from '@polkadot/ui-settings';

import { ModuleType, IModuleInterface, IAsset } from '../types';

const defaultAssetModules: Record<ModuleType, string[]> = {
  balance: [],
};

const moduleInterfaces: Record<ModuleType, IModuleInterface> = {
  balance: {
    query: [
      'freeBalance',
      'locks',
      'reservedBalance',
      'totalIssuance',
      'vesting',
    ],
    tx: [
      'setBalance',
      'transfer',
    ],
  }
}

const ZERO_BALANCE = createType('Balance', 0);
const ZERO_VEC = createType('Vec<BalanceLock>', []);

export default class Assets {
  private _api!: ApiPromise;

  private _assetModules: Record<ModuleType, string[]> = defaultAssetModules;

  private _modulesDetecting: Promise<void> = new Promise(() => void 0);

  constructor() {
    this.updateApiUrl(settings.apiUrl);
  }

  public updateApiUrl(newUrl: string) {
    if (this._api) {
      this._api.disconnect();
    }
    this._api = new ApiPromise(new WsProvider(newUrl));
    this._assetModules = defaultAssetModules;
    this._modulesDetecting = new Promise(resolve => {
      this._api.once('ready', (api: ApiPromise) => {
        this.detectAssetModules(api);
        resolve();
      });
    })
  }

  private detectAssetModules(api: ApiPromise): void {
    if (this._api === api) {
      this._assetModules = (Object.keys(moduleInterfaces) as ModuleType[])
        .reduce<Record<ModuleType, string[]>>((acc, cur) => {
          return {
            ...acc,
            [cur]: findInterfaceImplements(api, moduleInterfaces[cur]),
          }
        }, defaultAssetModules);
    }
  }

  public async loadAssets(address: string): Promise<IAsset[]> {
    await this._modulesDetecting;

    return Promise.all(
      this._assetModules.balance.map(this.loadBalanceAssets.bind(this, address)),
    )
  }

  private async loadBalanceAssets(address: string, fromModule: string): Promise<IAsset> {
    const query = this._api.query[fromModule];

    const [free = ZERO_BALANCE, locks = ZERO_VEC, reserved = ZERO_BALANCE]: [Balance?, Vec<BalanceLock>?, Balance?] =
      await Promise.all([
        query.freeBalance(address),
        query.locks(address),
        query.reservedBalance(address),
      ]) as any; // FIXME need to remove 'any'

    return {
      type: 'balance',
      fromModule,
      payload: {
        symbol: 'Coin',
        free: free.toString(),
        locks: locks.map(lock => lock.toString()),
        reserved: reserved.toString(),
      }
    }
  }
}

function findInterfaceImplements(api: ApiPromise, { query, tx }: IModuleInterface): string[] {
  const modules: string[] = Array.from(new Set([
    ...Object.keys(api.query),
    ...Object.keys(api.tx),
  ]));

  return modules.filter(moduleName => {
    const isQueryImplements = !!api.query[moduleName] && isContainKeys(api.query[moduleName], query);
    const isTxImplements = !!api.tx[moduleName] && isContainKeys(api.tx[moduleName], tx);
    return isQueryImplements && isTxImplements;
  })
}

function isContainKeys(obj: {}, keys: string[]): boolean {
  const objKeys = Object.keys(obj);
  const extendedKeys = Array.from(new Set([...objKeys, ...keys]))
  return objKeys.length === extendedKeys.length;
}
