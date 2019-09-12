// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountJson, AuthorizeRequest, SigningRequest, AssetsByAddress, ChainState } from '@polkadot/extension/background/types';
import { Prefix } from '@polkadot/util-crypto/address/types';
import { formatBalance } from '@polkadot/util';

import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router';
import settings from '@polkadot/ui-settings';
import { setAddressPrefix } from '@polkadot/util-crypto';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';

import { Loading } from '../components';
import { AccountContext, ActionContext, AuthorizeContext, MediaContext, SigningContext, AssetsContext, ChainStateContext } from '../components/contexts';
import { subscribeAccounts, subscribeAuthorize, subscribeSigning, subscribeAssets, subscribeChainState } from '../messaging';
import Accounts from './Accounts';
import Authorize from './Authorize';
import Create from './Create';
import Forget from './Forget';
import ImportQr from './ImportQr';
import Settings from './Settings';
import Signing from './Signing';
import Welcome from './Welcome';
import Assets from './Assets';
import { routes } from '../routes';

// Request permission for video, based on access we can hide/show import
async function requestMediaAccess (): Promise<boolean> {
  try {
    await navigator.mediaDevices.getUserMedia({ video: true });

    return true;
  } catch (error) {
    console.error('Permission for video declined', error.message);
  }

  return false;
}

// load the ui settings, actually only used for address prefix atm
// probably overkill (however can replace once we have actual others)
const { prefix } = settings.get();

// FIXME Duplicated in Settings, horrible...
setAddressPrefix((prefix === -1 ? 42 : prefix) as Prefix);

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#613AAF'
    },
    secondary: {
      main: '#ffffff'
    }
  }
});

export default function Popup (): React.ReactElement<{}> {
  const [accounts, setAccounts] = useState<null | AccountJson[]>(null);
  const [authRequests, setAuthRequests] = useState<null | AuthorizeRequest[]>(null);
  const [mediaAllowed, setMediaAllowed] = useState(false);
  const [signRequests, setSignRequests] = useState<null | SigningRequest[]>(null);
  const [assets, setAssets] = useState<AssetsByAddress | null>(null);
  const [chainState, setChainState] = useState<ChainState | null>(null);
  const [isWelcomeDone, setWelcomeDone] = useState(false);

  const _onAction = (to?: string): void => {
    setWelcomeDone(window.localStorage.getItem('welcome_read') === 'ok');

    if (to) {
      window.location.hash = to;
    }
  };

  const handleChainStateChanging = React.useCallback((state: ChainState | null) => {
    state && formatBalance.setDefaults({
      decimals: state.baseUnitProps.decimals,
      unit: state.baseUnitProps.symbol
    });
    setChainState(state);
  }, []);

  useEffect((): void => {
    Promise.all([
      requestMediaAccess().then(setMediaAllowed),
      subscribeAccounts(setAccounts),
      subscribeAuthorize(setAuthRequests),
      subscribeSigning(setSignRequests),
      subscribeAssets(setAssets),
      subscribeChainState(handleChainStateChanging)
    ]).catch((error: Error) => console.error(error));
    _onAction();
  }, []);

  const Root = isWelcomeDone
    ? authRequests && authRequests.length
      ? Authorize
      : signRequests && signRequests.length
        ? Signing
        : Accounts
    : Welcome;

  return (
    <Loading>{accounts && authRequests && signRequests && chainState && (
      <ThemeProvider theme={theme}>
        <ActionContext.Provider value={_onAction}>
          <AccountContext.Provider value={accounts}>
            <AuthorizeContext.Provider value={authRequests}>
              <MediaContext.Provider value={mediaAllowed}>
                <SigningContext.Provider value={signRequests}>
                  <AssetsContext.Provider value={assets}>
                    <ChainStateContext.Provider value={chainState}>
                      <Switch>
                        <Route path={routes.account.create.getRoutePath()}>
                          <Create type="createNew" />
                        </Route>
                        <Route path={routes.account.forget.address.getRoutePath()} component={Forget} />
                        <Route path={routes.account.importQr.getRoutePath()} component={ImportQr} />
                        <Route path={routes.account.importSeed.getRoutePath()}>
                          <Create type="import" />
                        </Route>
                        <Route path={routes.assets.address.getRoutePath()} component={Assets} />
                        <Route path={routes.settings.getRoutePath()} component={Settings} />
                        <Route exact path='/' component={Root} />
                      </Switch>
                    </ChainStateContext.Provider>
                  </AssetsContext.Provider>
                </SigningContext.Provider>
              </MediaContext.Provider>
            </AuthorizeContext.Provider>
          </AccountContext.Provider>
        </ActionContext.Provider>
      </ThemeProvider>
    )}</Loading>
  );
}
