// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountsFromCtx } from '../../components/types';

import React from 'react';

import { Tip, withAccounts, withOnAction, LinkButton, Grid } from '../../components';
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
        <LinkButton key="Create" to={routes.account.create.getRedirectPath()} size="small">Create account</LinkButton>,
        <LinkButton key="Import" to={routes.account.import.getRedirectPath()} size="small">Import account</LinkButton>,
      ]}
    >
      <Layout.Content variant="secondary">
        {
          (accounts.length === 0)
            ? <Tip header='add accounts' type='warn'>You currently don&apos;t have any accounts. Either create a new account or if you have an existing account you wish to use, import it with the seed phrase</Tip>
            : (
              <Grid container spacing={2}>
                {accounts.map(({ address }): React.ReactNode => (
                  <Grid item xs={12} key={address}>
                    <Account address={address} onClick={_onAddressClick} />
                  </Grid>
                ))}
              </Grid>
            )
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
