// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { OnActionFromCtx } from '../components/types';

import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import { Address, Button, Tip, withOnAction, BackButton } from '../components';
import { forgetAccount } from '../messaging';
import Layout from './Layout';

interface Props extends RouteComponentProps<{ address: string }> {
  onAction: OnActionFromCtx;
}

function Forget({ match: { params: { address } }, onAction }: Props): React.ReactElement<Props> {
  const onClick = (): Promise<void> =>
    forgetAccount(address)
      .then((): void => onAction('/'))
      .catch(console.error);

  return (
    <Layout
      actions={[
        <BackButton key='Cancel'>Cancel</BackButton>,
        <Button isDanger key='Forget' onClick={onClick}>Forget</Button>
      ]}
    >
      <Layout.Content variant="primary">
        <Address address={address} boxTheme="dark" />
      </Layout.Content>
      <Layout.Content variant="secondary">
        <Tip header='danger' type='error'>You are about to remove the account. This means that you will not be able to access it via this extension anymore. If you wish to recover it, you would need to use the seed.</Tip>
      </Layout.Content>
    </Layout>
  );
}

export default withOnAction(withRouter(Forget));
