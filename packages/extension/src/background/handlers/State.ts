// Copyright 2019 @polkadot/extension-bg authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountJson, AuthorizeRequest, RequestAuthorizeTab, RequestExtrinsicSign, ResponseExtrinsicSign, SigningRequest } from '../types';

import extension from 'extensionizer';
import { BehaviorSubject } from 'rxjs';
import { assert } from '@polkadot/util';

interface AuthRequest {
  id: string;
  idStr: string;
  request: RequestAuthorizeTab;
  resolve: (result: boolean) => void;
  reject: (error: Error) => void;
  url: string;
}

type AuthUrls = Record<string, {
  count: number;
  id: string;
  isAllowed: boolean;
  origin: string;
  url: string;
}>;

interface SignRequest {
  account: AccountJson;
  id: string;
  request: RequestExtrinsicSign;
  resolve: (result: ResponseExtrinsicSign) => void;
  reject: (error: Error) => void;
  url: string;
}

let idCounter = 0;

function getId (): string {
  return `${Date.now()}.${++idCounter}`;
}

export default class State {
  private _authUrls: AuthUrls = {};

  private _authRequests: Record<string, AuthRequest> = {};

  private _signRequests: Record<string, SignRequest> = {};

  private _windows: number[] = [];

  public readonly authSubject: BehaviorSubject<AuthorizeRequest[]> = new BehaviorSubject([] as AuthorizeRequest[]);

  public readonly signSubject: BehaviorSubject<SigningRequest[]> = new BehaviorSubject([] as SigningRequest[]);

  public get hasAuthRequests (): boolean {
    return this.numAuthRequests === 0;
  }

  public get hasSignRequests (): boolean {
    return this.numSignRequests === 0;
  }

  public get numAuthRequests (): number {
    return Object.keys(this._authRequests).length;
  }

  public get numSignRequests (): number {
    return Object.keys(this._signRequests).length;
  }

  public get allAuthRequests (): AuthorizeRequest[] {
    return Object
      .values(this._authRequests)
      .map(({ id, request, url }): AuthorizeRequest => ({ id, request, url }));
  }

  public get allSignRequests (): SigningRequest[] {
    return Object
      .values(this._signRequests)
      .map(({ account, id, request, url }): SigningRequest => ({ account, id, request, url }));
  }

  private popupClose (popupId?: number): void {
    this._windows.forEach((id: number): void => {
      const isRemovable = typeof popupId === 'number' ? id === popupId : true;
      isRemovable && extension.windows.remove(id);
    });
    this._windows = [];
  }

  private popupOpen (onOpen?: (popupId: number) => void): void {
    extension.windows.create({
      // This is not allowed on FF, only on Chrome - disable completely
      // focused: true,
      height: 600,
      left: 150,
      top: 150,
      type: 'popup',
      url: extension.extension.getURL('index.html'),
      width: 360
    }, (window?: chrome.windows.Window): void => {
      if (window) {
        this._windows.push(window.id);
        onOpen && onOpen(window.id);
      }
    });
  }

  private authComplete = (id: string, fn: Function): (result: boolean | Error) => void => {
    return (result: boolean | Error): void => {
      const isAllowed = result === true;
      const { idStr, request: { origin }, url } = this._authRequests[id];

      this._authUrls[this.stripUrl(url)] = {
        count: 0,
        id: idStr,
        isAllowed,
        origin,
        url
      };

      delete this._authRequests[id];
      this.updateIconAuth(true);

      fn(result);
    };
  }

  private signComplete = (id: string, popupId: number, fn: Function): (result: ResponseExtrinsicSign | Error) => void => {
    return (result: ResponseExtrinsicSign | Error): void => {
      delete this._signRequests[id];
      this.updateIconSign(true, popupId);

      fn(result);
    };
  }

  private stripUrl (url: string): string {
    assert(url && (url.startsWith('http:') || url.startsWith('https:')), `Invalid url ${url}, expected to start with http: or https:`);

    const parts = url.split('/');

    return parts[2];
  }

  private updateIcon (shouldClose?: boolean, popupId?: number): void {
    const authCount = this.numAuthRequests;
    const signCount = this.numSignRequests;
    const text = (
      authCount
        ? 'Auth'
        : (signCount ? `${signCount}` : '')
    );

    extension.browserAction.setBadgeText({ text });

    if (shouldClose && text === '') {
      this.popupClose(popupId);
    }
  }

  private updateIconAuth (shouldClose?: boolean): void {
    this.authSubject.next(this.allAuthRequests);
    this.updateIcon(shouldClose);
  }

  private updateIconSign (shouldClose?: boolean, popupId?: number): void {
    this.signSubject.next(this.allSignRequests);
    this.updateIcon(shouldClose, popupId);
  }

  public async authorizeUrl (url: string, request: RequestAuthorizeTab): Promise<boolean> {
    const idStr = this.stripUrl(url);

    if (this._authUrls[idStr]) {
      assert(this._authUrls[idStr].isAllowed, `The source ${url} is not allowed to interact with this extension`);

      return true;
    }

    return new Promise((resolve, reject): void => {
      const id = getId();

      this._authRequests[id] = {
        id,
        idStr,
        request,
        resolve: this.authComplete(id, resolve),
        reject: this.authComplete(id, reject),
        url
      };

      this.updateIconAuth();
      this.popupOpen();
    });
  }

  public ensureUrlAuthorized (url: string): boolean {
    const entry = this._authUrls[this.stripUrl(url)];

    assert(entry, `The source ${url} has not been enabled yet`);
    assert(entry.isAllowed, `The source ${url} is not allowed to interact with this extension`);

    return true;
  }

  public getAuthRequest (id: string): AuthRequest {
    return this._authRequests[id];
  }

  public getSignRequest (id: string): SignRequest {
    return this._signRequests[id];
  }

  public signQueue (url: string, request: RequestExtrinsicSign, account: AccountJson): Promise<ResponseExtrinsicSign> {
    const id = getId();

    return new Promise((resolve, reject): void => {
      let popupId = -1;
      this._signRequests[id] = {
        account,
        id,
        request,
        resolve: (result): void => {
          this.signComplete(id, popupId, resolve)(result);
        },
        reject: (result): void => {
          this.signComplete(id, popupId, reject)(result);
        },
        url
      };

      this.updateIconSign();
      this.popupOpen(id => {
        popupId = id;
      });
    });
  }
}
