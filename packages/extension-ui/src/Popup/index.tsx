// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AuthorizeRequest, SigningRequest } from '@polkadot/extension/background/types';
import { KeyringJson } from '@polkadot/ui-keyring/types';
import { Prefix } from '@polkadot/util-crypto/address/types';

import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router';
import settings from '@polkadot/ui-settings';
import { setAddressPrefix } from '@polkadot/util-crypto';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';

import { Loading } from '../components';
import { AssetsFromCtx } from '../components/types';
import { AccountContext, ActionContext, AuthorizeContext, SigningContext, AssetsContext } from '../components/contexts';
import { subscribeAccounts, subscribeAuthorize, subscribeSigning, subscribeAssets } from '../messaging';
import Accounts from './Accounts';
import Authorize from './Authorize';
import Create from './Create';
import Forget from './Forget';
import Settings from './Settings';
import Signing from './Signing';
import Welcome from './Welcome';
import Assets from './Assets';
import { routes } from '../routes';

// load the ui settings, actually only used for address prefix atm
// probably overkill (however can replace once we have actual others)
const { prefix } = settings.get();

// FIXME Duplicated in Settings, horrible...
setAddressPrefix((prefix === -1 ? 42 : prefix) as Prefix);

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#613AAF',
    },
    secondary: {
      main: '#ffffff',
    },
  },
});

export default function Popup(): React.ReactElement<{}> {
  const [accounts, setAccounts] = useState<null | KeyringJson[]>(null);
  const [authRequests, setAuthRequests] = useState<null | AuthorizeRequest[]>(null);
  const [signRequests, setSignRequests] = useState<null | SigningRequest[]>(null);
  const [assets, setAssets] = useState<AssetsFromCtx>(null);
  const [isWelcomeDone, setWelcomeDone] = useState(false);

  const onAction = (to?: string): void => {
    setWelcomeDone(window.localStorage.getItem('welcome_read') === 'ok');

    if (to) {
      window.location.hash = to;
    }
  };

  useEffect((): void => {
    Promise.all([
      subscribeAccounts(setAccounts),
      subscribeAuthorize(setAuthRequests),
      subscribeSigning(setSignRequests),
      subscribeAssets(setAssets),
    ]).catch((error: Error) => console.error(error));
    onAction();
  }, []);

  const Root = isWelcomeDone
    ? authRequests && authRequests.length
      ? Authorize
      : signRequests && signRequests.length
        ? Signing
        : Accounts
    : Welcome;

  return (
    <Loading>{accounts && authRequests && signRequests && (
      <ThemeProvider theme={theme}>
        <ActionContext.Provider value={onAction}>
          <AccountContext.Provider value={accounts}>
            <AuthorizeContext.Provider value={authRequests}>
              <SigningContext.Provider value={signRequests}>
                <AssetsContext.Provider value={assets}>
                  <Switch>
                    <Route path={routes.account.create.getRoutePath()}>
                      <Create type="createNew" />
                    </Route>
                    <Route path={routes.account.forget.address.getRoutePath()} component={Forget} />
                    <Route path={routes.account.import.getRoutePath()}>
                      <Create type="import" />
                    </Route>
                    <Route path={routes.assets.address.getRoutePath()} component={Assets} />
                    <Route path={routes.settings.getRoutePath()} component={Settings} />
                    <Route exact path='/' component={Root} />
                  </Switch>
                </AssetsContext.Provider>
              </SigningContext.Provider>
            </AuthorizeContext.Provider>
          </AccountContext.Provider>
        </ActionContext.Provider>
      </ThemeProvider>
    )}</Loading>
  );
}
