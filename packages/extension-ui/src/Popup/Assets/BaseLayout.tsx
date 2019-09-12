// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import { Address, Grid } from '../../components';
import Layout, { ContentProps } from '../Layout';

interface Props extends RouteComponentProps<{ address: string }> {
  addressActions?: React.ReactNode[];
  mainActions?: React.ReactNode[];
  children?: React.ReactNode;
  contentProps?: Partial<ContentProps>;
}

function BaseLayout (props: Props): React.ReactElement<Props> {
  const { match, mainActions, addressActions, children, contentProps } = props;
  const { address } = match.params;

  return (
    <Layout actions={mainActions}>
      <Layout.Content variant="primary">
        <Address withBalance address={address} boxTheme="dark">
          {addressActions && !!addressActions.length && (
            <Grid container spacing={1} justify="flex-end">
              {addressActions.map((item, index) => (
                <Grid item key={index}>{item}</Grid>
              ))}
            </Grid>
          )}
        </Address>
      </Layout.Content>
      <Layout.Content variant="secondary" {...contentProps}>
        {children}
      </Layout.Content>
    </Layout>
  );
}

export default withRouter(BaseLayout);
