// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountsFromCtx } from '../../components/types';

import React from 'react';

import { Button, Tip, withAccounts, withOnAction } from '../../components';
import { routes } from '../../routes';
import Layout from '../Layout';
import Account from './Account';

interface Props {
  accounts: AccountsFromCtx;
  onAction(to?: string): void;
}

function Accounts({ accounts, onAction }: Props): React.ReactElement<Props> {
  const _onAddressClick = React.useCallback((address: string) => {
    onAction(routes.assets.address.getRedirectPath({ address }))
  }, []);

  return (
    <Layout
      actions={[
        <Button key="Create" label='Create account' to={routes.account.create.getRedirectPath()} />,
        <Button key="Import" label='Import account' to={routes.account.import.getRedirectPath()} />,
      ]}
    >
      <Layout.Content variant="secondary">
        {
          (accounts.length === 0)
            ? <Tip header='add accounts' type='warn'>You currently don&apos;t have any accounts. Either create a new account or if you have an existing account you wish to use, import it with the seed phrase</Tip>
            : accounts.map(({ address }): React.ReactNode => (
              <Account
                address={address}
                onClick={_onAddressClick}
                key={address}
              />
            ))
        }
      </Layout.Content>
    </Layout>
  );
}

export default (
  withOnAction(
    withAccounts(Accounts),
  )
);
