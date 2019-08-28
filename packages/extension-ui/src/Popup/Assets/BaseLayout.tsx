// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import { Address, Grid } from '../../components';
import Layout from '../Layout';

interface Props extends RouteComponentProps<{ address: string }> {
  addressActions?: React.ReactNode[];
  mainActions?: React.ReactNode[];
  children: React.ReactNode;
}

function BaseLayout(props: Props): React.ReactElement<Props> {
  const { match, mainActions, addressActions, children } = props;
  const { address } = match.params;

  return (
    <Layout actions={mainActions}>
      <Layout.Content variant="primary">
        <Address withBalance address={address} boxTheme="dark">
          {addressActions && !!addressActions.length && (
            <Grid container spacing={8} justify="flex-end">
              {addressActions.map((item, index) => (
                <Grid item key={index}>{item}</Grid>
              ))}
            </Grid>
          )}
        </Address>
      </Layout.Content>
      <Layout.Content variant="secondary">
        {children}
      </Layout.Content>
    </Layout>
  );
}

export default withRouter(BaseLayout);
