// Copyright 2019 @polkadot/extension authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, pairwise, tap, concatMap, switchMap } from 'rxjs/operators';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { createType, Vec } from '@polkadot/types';
import { Balance, BalanceLock } from '@polkadot/types/interfaces';
import settings from '@polkadot/ui-settings';
import accountsObservable from '@polkadot/ui-keyring/observable/accounts';

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
  private readonly _apiUrl = new BehaviorSubject(settings.apiUrl);

  private readonly _api: Observable<ApiPromise> = this._apiUrl.asObservable().pipe(
    concatMap(async url => {
      const api = new ApiPromise({ provider: new WsProvider(url) });
      await new Promise(resolve => api.once('ready', resolve));
      return api;
    }),
  );

  private readonly _assetModules: Observable<Record<ModuleType, string[]>> = this._api.pipe(
    map(this.getAssetModules),
  );

  public readonly balances: Observable<Record<string, IAsset[]>> = combineLatest(
    this._api,
    this._assetModules,
    accountsObservable.subject.asObservable(),
  ).pipe(
    switchMap(async ([api, assetModules, _accounts]) => {
      const addresses = Object.values(_accounts).map(({ json }) => json.address);
      return this.loadAssets(api, assetModules, addresses);
    })
  );

  constructor() {
    // disconnect previous api instance
    this._api.pipe(
      pairwise(),
      tap(([prev]) => prev.disconnect()),
    ).subscribe();
  }

  public updateApiUrl(url: string) {
    this._apiUrl.next(url);
  }

  private getAssetModules(api: ApiPromise): Record<ModuleType, string[]> {
    return (Object.keys(moduleInterfaces) as ModuleType[])
      .reduce<Record<ModuleType, string[]>>((acc, cur) => {
        return {
          ...acc,
          [cur]: findInterfaceImplements(api, moduleInterfaces[cur]),
        }
      }, defaultAssetModules);
  }

  public async loadAssets(api: ApiPromise, assetModules: Record<ModuleType, string[]>, addresses: string[]): Promise<Record<string, IAsset[]>> {
    const allAssets = (await Promise.all(
      addresses.map(async address => ({
        address,
        assets: await this.loadAssetsByAddress(api, assetModules, address),
      })),
    ))

    return allAssets.reduce((acc, { address, assets }) => ({ ...acc, [address]: assets }), {});
  }

  public async loadAssetsByAddress(api: ApiPromise, assetModules: Record<ModuleType, string[]>, address: string): Promise<IAsset[]> {
    return Promise.all(
      assetModules.balance.map(this.loadBalanceAssets.bind(this, api, address)),
    )
  }

  private async loadBalanceAssets(api: ApiPromise, address: string, fromModule: string): Promise<IAsset> {
    const query = api.query[fromModule];

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
