// Copyright 2019 @polkadot/extension authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, tap, switchMap, first, takeWhile, filter } from 'rxjs/operators';
import { ApiRx, WsProvider } from '@polkadot/api';
import { DerivedBalances } from '@polkadot/api-derive/types';
import settings from '@polkadot/ui-settings';
import accountsObservable from '@polkadot/ui-keyring/observable/accounts';
import { SubjectInfo as AccountsInfo } from '@polkadot/ui-keyring/observable/types';

import Injected from '../../page/Injected';
import { ModuleType, IModuleInterface, IAsset, IBalanceAsset, AssetsByAddress } from '../types';
import State from './State';

const defaultAssetModules: AssetModules = {
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

type AssetModules = Record<ModuleType, string[]>;

export default class AssetsClass {

  private _state: State;

  private readonly _apiUrl = new BehaviorSubject(settings.apiUrl);

  private readonly _api = new BehaviorSubject<ApiRx | null>(null);

  private readonly _assetModules = new BehaviorSubject<AssetModules | null>(null);

  public readonly assets = new BehaviorSubject<AssetsByAddress | null>(null);

  constructor(state: State) {
    this._state = state;

    this._apiUrl.asObservable().pipe(
      tap(() => {
        const prevApi = this._api.getValue();
        prevApi && prevApi.disconnect();
        this._api.next(null);
      }),
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
    ).subscribe(value => this._api.next(value));

    this._api.asObservable().pipe(
      tap(() => this._assetModules.next(null)),
      filter((value): value is ApiRx => !!value),
      map(this.getAssetModules),
    ).subscribe(value => this._assetModules.next(value));

    combineLatest(
      this._api.asObservable(),
      this._assetModules.asObservable(),
      accountsObservable.subject.asObservable(),
    ).pipe(
      tap(([api, assetModules, _accounts]) => (!api || !assetModules) && this.assets.next(null)),
      filter((value): value is [ApiRx, AssetModules, AccountsInfo] => {
        const api: ApiRx | null = value[0];
        const assetModules: AssetModules | null = value[1];
        return Boolean(api && assetModules);
      }),
      switchMap(([api, assetModules, _accounts]) => {
        const addresses = Object.values(_accounts).map(({ json }) => json.address);
        return this.loadAssets(api, assetModules, addresses);
      }),
      map(assetsWithAddress => {
        return assetsWithAddress.reduce((acc, { address, assets }) => ({ ...acc, [address]: assets }), {});
      }),
    ).subscribe(value => this.assets.next(value));
  }

  public updateApiUrl(url: string) {
    this._apiUrl.next(url);
  }

  private getAssetModules(api: ApiRx): AssetModules {
    return (Object.keys(moduleInterfaces) as ModuleType[])
      .reduce<AssetModules>((acc, cur) => {
        return {
          ...acc,
          [cur]: findInterfaceImplements(api, moduleInterfaces[cur]),
        }
      }, defaultAssetModules);
  }

  public loadAssets(
    api: ApiRx, assetModules: AssetModules, addresses: string[],
  ): Observable<Array<{ address: string, assets: IAsset[] }>> {
    return combineLatest(addresses.map(
      address => this.loadAssetsByAddress(api, assetModules, address).pipe(
        map(assets => ({ address, assets })),
      ),
    ));
  }

  public loadAssetsByAddress(api: ApiRx, assetModules: AssetModules, address: string): Observable<IAsset[]> {
    return combineLatest(
      assetModules.balance.map(this.loadBalanceAssets.bind(this, api, address)),
      // ... handlers for other assets
    )
  }

  private loadBalanceAssets(api: ApiRx, address: string, fromModule: string): Observable<IBalanceAsset> {
    const balance$: Observable<DerivedBalances> = api.derive.balances.all(address);

    return balance$.pipe(map(
      balance => ({
        type: 'balance',
        fromModule,
        payload: balance,
      }),
    ));
  }

  public async sendBaseUnits(from: string, to: string, amount: string) {
    const api = await this._api.asObservable().pipe(
      filter((value): value is ApiRx => !!value),
      first(),
    ).toPromise();

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
