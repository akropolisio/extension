// Copyright 2019 @polkadot/extension authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, tap, switchMap, first, takeWhile, filter } from 'rxjs/operators';
import { ApiRx, WsProvider } from '@polkadot/api';
import { DerivedBalances } from '@polkadot/api-derive/types';
import { ChainProperties } from '@polkadot/types/interfaces';
import U32 from '@polkadot/types/primitive/U32';
import settings from '@polkadot/ui-settings';
import keyring from '@polkadot/ui-keyring';
import accountsObservable from '@polkadot/ui-keyring/observable/accounts';
import { SubjectInfo as AccountsInfo } from '@polkadot/ui-keyring/observable/types';
import { assert } from '@polkadot/util';

import Injected from '../../page/Injected';
import { SendRequest } from '../../page/types';
import { ModuleType, ModuleInterface, Asset, BalanceAsset, AssetsByAddress, ChainState, MessageTypes, RequestTypes, ResponseTypes, RequestExtrinsicSign } from '../types';
import { akroApiUrls, akroTypes } from '../chainTypes';
import State from './State';

const defaultAssetModules: AssetModules = {
  balance: []
};

const moduleInterfaces: Record<ModuleType, ModuleInterface> = {
  balance: {
    query: [
      'freeBalance',
      'locks',
      'reservedBalance',
      'totalIssuance',
      'vesting'
    ],
    tx: [
      'setBalance',
      'transfer'
    ]
  }
};

type AssetModules = Record<ModuleType, string[]>;

const makeSendRequest: (state: State) => SendRequest = (state: State) =>
  async <TMessageType extends MessageTypes>(message: TMessageType, request?: RequestTypes[TMessageType]): Promise<ResponseTypes[keyof ResponseTypes]> => {
    switch (message) {
      case 'pub(extrinsic.sign)': {
        const { address } = request as RequestExtrinsicSign;
        const pair = keyring.getPair(address);

        assert(pair, 'Unable to find keypair');

        const response = await state.signQueue('from extension', request as RequestExtrinsicSign, { address, ...pair.meta });
        return response;
      }
      default: {
        throw new Error(`Unable to handle message of type ${message}`);
      }
    }
  };

function isContainKeys (obj: {}, keys: string[]): boolean {
  const objKeys = Object.keys(obj);
  const extendedKeys = Array.from(new Set([...objKeys, ...keys]));
  return objKeys.length === extendedKeys.length;
}

function findInterfaceImplements (api: ApiRx, { query, tx }: ModuleInterface): string[] {
  const modules: string[] = Array.from(new Set([
    ...Object.keys(api.query),
    ...Object.keys(api.tx)
  ]));

  return modules.filter(moduleName => {
    const isQueryImplements = !!api.query[moduleName] && isContainKeys(api.query[moduleName], query);
    const isTxImplements = !!api.tx[moduleName] && isContainKeys(api.tx[moduleName], tx);
    return isQueryImplements && isTxImplements;
  });
}

export default class AssetsClass {
  private _state: State;

  private readonly _apiUrl = new BehaviorSubject(settings.apiUrl);

  private readonly _api = new BehaviorSubject<ApiRx | null>(null);

  private readonly _assetModules = new BehaviorSubject<AssetModules | null>(null);

  public readonly assets = new BehaviorSubject<AssetsByAddress | null>(null);

  public readonly chainState = new BehaviorSubject<ChainState | null>(null);

  constructor (state: State) {
    this._state = state;

    this._apiUrl.asObservable().pipe(
      tap(() => {
        const prevApi = this._api.getValue();
        prevApi && prevApi.disconnect();
        this._api.next(null);
      }),
      switchMap(url => ApiRx.create({
        provider: new WsProvider(url),
        signer: new Injected(makeSendRequest(this._state)).signer,
        types: akroApiUrls.includes(url) ? akroTypes : undefined
      }))
    ).subscribe(value => this._api.next(value));

    this._api.asObservable().pipe(
      tap(() => this._assetModules.next(null)),
      filter((value): value is ApiRx => !!value),
      map(this.getAssetModules.bind(this))
    ).subscribe(value => this._assetModules.next(value));

    combineLatest(
      this._api.asObservable(),
      this._assetModules.asObservable(),
      accountsObservable.subject.asObservable()
    ).pipe(
      tap(([api, assetModules]) => (!api || !assetModules) && this.assets.next(null)),
      filter((value): value is [ApiRx, AssetModules, AccountsInfo] => {
        const api: ApiRx | null = value[0];
        const assetModules: AssetModules | null = value[1];
        return Boolean(api && assetModules);
      }),
      switchMap(([api, assetModules, accounts]) => {
        const addresses = Object.values(accounts).map(({ json }) => json.address);
        return this.loadAssets(api, assetModules, addresses);
      }),
      map(assetsWithAddress => {
        return assetsWithAddress.reduce((acc, { address, assets }) => ({ ...acc, [address]: assets }), {});
      })
    ).subscribe(value => this.assets.next(value));

    this._api.asObservable().pipe(
      tap(() => this.chainState.next(null)),
      filter((value): value is ApiRx => !!value),
      switchMap(this.loadChainState.bind(this))
    ).subscribe(value => this.chainState.next(value));
  }

  public updateApiUrl (url: string): void {
    this._apiUrl.next(url);
  }

  private getAssetModules (api: ApiRx): AssetModules {
    return (Object.keys(moduleInterfaces) as ModuleType[])
      .reduce<AssetModules>((acc, cur) => {
      return {
        ...acc,
        [cur]: findInterfaceImplements(api, moduleInterfaces[cur])
      };
    }, defaultAssetModules);
  }

  private loadAssets (
    api: ApiRx, assetModules: AssetModules, addresses: string[]
  ): Observable<Array<{ address: string; assets: Asset[] }>> {
    return combineLatest(addresses.map(
      address => this.loadAssetsByAddress(api, assetModules, address).pipe(
        map(assets => ({ address, assets }))
      )
    ));
  }

  private loadAssetsByAddress (api: ApiRx, assetModules: AssetModules, address: string): Observable<Asset[]> {
    return combineLatest(
      assetModules.balance.map(this.loadBalanceAssets.bind(this, api, address))
      // ... handlers for other assets
    );
  }

  private loadBalanceAssets (api: ApiRx, address: string, fromModule: string): Observable<BalanceAsset> {
    const balance$: Observable<DerivedBalances> = api.derive.balances.all(address);

    return balance$.pipe(map<DerivedBalances, BalanceAsset>(
      balance => ({
        type: 'balance',
        fromModule,
        payload: {
          available: balance.availableBalance.toString(),
          free: balance.freeBalance.toString(),
          locked: balance.lockedBalance.toString(),
          reserved: balance.reservedBalance.toString(),
          vested: balance.vestedBalance.toString(),
          voting: balance.votingBalance.toString()
        }
      })
    ));
  }

  private loadChainState (api: ApiRx): Observable<ChainState> {
    const chainProps$: Observable<ChainProperties> = api.rpc.system.properties();

    return chainProps$.pipe(map<ChainProperties, ChainState>(
      props => ({
        baseUnitProps: {
          decimals: props.tokenDecimals.unwrapOr(new U32(15)).toNumber(),
          symbol: props.tokenSymbol.unwrapOr('DEV').toString()
        }
      })
    ));
  }

  public async sendBaseUnits (from: string, to: string, amount: string): Promise<void> {
    const api = await this._api.asObservable().pipe(
      filter((value): value is ApiRx => !!value),
      first()
    ).toPromise();

    const transfer = api.tx.balances.transfer(to, amount);
    const tx = transfer.signAndSend(from).pipe(
      takeWhile(({ status }) => !status.isFinalized, true)
    );

    await tx.toPromise();
  }
}
