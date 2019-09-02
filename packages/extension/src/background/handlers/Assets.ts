// Copyright 2019 @polkadot/extension authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, pairwise, tap, switchMap, first, takeWhile } from 'rxjs/operators';
import { ApiRx, WsProvider } from '@polkadot/api';
import { createType, Vec } from '@polkadot/types';
import { Balance, BalanceLock } from '@polkadot/types/interfaces';
import settings from '@polkadot/ui-settings';
import accountsObservable from '@polkadot/ui-keyring/observable/accounts';

import Injected from '../../page/Injected';
import { ModuleType, IModuleInterface, IAsset, IBalanceAsset } from '../types';
import State from './State';

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

export default class Assets {
  private _state: State;

  private readonly _apiUrl = new BehaviorSubject(settings.apiUrl);

  private readonly _api: Observable<ApiRx> = this._apiUrl.asObservable().pipe(
    switchMap(url => ApiRx.create({
      provider: new WsProvider(url),
      signer: new Injected(async (message, request) => {
        switch (message) {
          case 'extrinsic.sign': {
            return await this._state.signQueue('from extension', request);
          }
          default: return;
        }
      }).signer,
    })),
  );

  private readonly _assetModules: Observable<Record<ModuleType, string[]>> = this._api.pipe(
    map(this.getAssetModules),
  );

  public readonly balances: Observable<Record<string, IAsset[]>> = combineLatest(
    this._api,
    this._assetModules,
    accountsObservable.subject.asObservable(),
  ).pipe(
    switchMap(([api, assetModules, _accounts]) => {
      const addresses = Object.values(_accounts).map(({ json }) => json.address);
      return this.loadAssets(api, assetModules, addresses);
    }),
    map(assetsWithAddress => {
      return assetsWithAddress.reduce((acc, { address, assets }) => ({ ...acc, [address]: assets }), {});
    }),
  );

  constructor(state: State) {
    this._state = state;
    // disconnect previous api instance
    this._api.pipe(
      pairwise(),
      tap(([prev]) => prev.disconnect()),
    ).subscribe();
  }

  public updateApiUrl(url: string) {
    this._apiUrl.next(url);
  }

  private getAssetModules(api: ApiRx): Record<ModuleType, string[]> {
    return (Object.keys(moduleInterfaces) as ModuleType[])
      .reduce<Record<ModuleType, string[]>>((acc, cur) => {
        return {
          ...acc,
          [cur]: findInterfaceImplements(api, moduleInterfaces[cur]),
        }
      }, defaultAssetModules);
  }

  public loadAssets(
    api: ApiRx, assetModules: Record<ModuleType, string[]>, addresses: string[],
  ): Observable<Array<{ address: string, assets: IAsset[] }>> {
    return combineLatest(addresses.map(
      address => this.loadAssetsByAddress(api, assetModules, address).pipe(
        map(assets => ({ address, assets })),
      ),
    ));
  }

  public loadAssetsByAddress(api: ApiRx, assetModules: Record<ModuleType, string[]>, address: string): Observable<IAsset[]> {
    return combineLatest(
      assetModules.balance.map(this.loadBalanceAssets.bind(this, api, address)),
      // ... handlers for other assets
    )
  }

  private loadBalanceAssets(api: ApiRx, address: string, fromModule: string): Observable<IBalanceAsset> {
    const query = api.query[fromModule];

    return combineLatest([
      query.freeBalance<Balance>(address),
      query.locks<Vec<BalanceLock>>(address),
      query.reservedBalance<Balance>(address),
    ]).pipe(
      map(([free, locks, reserved]) => ({
        type: 'balance',
        fromModule,
        payload: {
          symbol: 'DOT',
          free: free.toString(),
          locks: locks.map(lock => lock.toString()),
          reserved: reserved.toString(),
        }
      })),
    );
  }

  public async sendBaseUnits(from: string, to: string, amount: string) {
    const api = await this._api.pipe(first()).toPromise();
    const transfer = api.tx.balances.transfer(to, amount);
    const tx = transfer.signAndSend(from).pipe(
      takeWhile(({ status }) => !status.isFinalized, true),
    );

    await tx.toPromise();
  }
}

function findInterfaceImplements(api: ApiRx, { query, tx }: IModuleInterface): string[] {
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
