// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountJson, AuthorizeRequest, SigningRequest, AssetsByAddress, ChainState } from '@polkadot/extension/background/types';

import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const noop = (to?: string): void => { };

const AccountContext = React.createContext<AccountJson[]>([]);
const ActionContext = React.createContext<(to?: string) => void>(noop);
const AuthorizeContext = React.createContext<AuthorizeRequest[]>([]);
const MediaContext = React.createContext<boolean>(false);
const SigningContext = React.createContext<SigningRequest[]>([]);
const AssetsContext = React.createContext<AssetsByAddress | null>(null);
const ChainStateContext = React.createContext<ChainState | null>(null);

export {
  AccountContext,
  ActionContext,
  AuthorizeContext,
  MediaContext,
  SigningContext,
  AssetsContext,
  ChainStateContext
};
