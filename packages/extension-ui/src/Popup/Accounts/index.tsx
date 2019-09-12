// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useContext } from 'react';

import { Tip, AccountContext, ActionContext, LinkButton, MediaContext, Grid } from '../../components';
import { routes } from '../../routes';
import Layout from '../Layout';
import Account from './Account';

export default function Accounts(): React.ReactElement<{}> {
  const accounts = useContext(AccountContext);
  const onAction = useContext(ActionContext);
  const mediaAllowed = useContext(MediaContext);

  const _onAddressClick = React.useCallback((address: string) => {
    onAction(routes.assets.address.getRedirectPath({ address }))
  }, []);

  const actions = [
    <LinkButton key="Create" to={routes.account.create.getRedirectPath()} size="small">Create account</LinkButton>,
    <LinkButton key="Import Seed" to={routes.account.importSeed.getRedirectPath()} size="small">Import from seed</LinkButton>,
    mediaAllowed && <LinkButton key="Import QR" to={routes.account.importQr.getRedirectPath()} size="small">Import from QR</LinkButton>,
  ].filter(Boolean);

  return (
    <Layout actions={actions}>
      <Layout.Content variant="secondary">
        {
          (accounts.length === 0)
            ? <Tip header='add accounts' type='warn'>You currently don&apos;t have any accounts. Either create a new account or if you have an existing account you wish to use, import it with the seed phrase</Tip>
            : (
              <Grid container spacing={2}>
                {accounts.map((json, index): React.ReactNode => (
                  <Grid item xs={12} key={`${index}:${json.address}`}>
                    <Account {...json} onClick={_onAddressClick} />
                  </Grid>
                ))}
              </Grid>
            )
        }
      </Layout.Content>
    </Layout>
  );
}
