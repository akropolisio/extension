// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { OnActionFromCtx } from '../components/types';

import React, { useState, useEffect } from 'react';

import { Address, Button, Loading, TextArea, withOnAction, LinkButton } from '../components';
import { createAccount, createSeed } from '../messaging';
import { Name, Password } from '../partials';
import Layout from './Layout';

interface Props {
  onAction: OnActionFromCtx;
}

function Create({ onAction }: Props): React.ReactElement<Props> {
  const [account, setAccount] = useState<null | { address: string; seed: string }>(null);
  const [name, setName] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  useEffect((): void => {
    createSeed()
      .then(setAccount)
      .catch(console.error);
  }, []);

  // FIXME Duplicated between here and Import.tsx
  const onCreate = (): void => {
    // this should always be the case
    if (name && password && account) {
      createAccount(name, password, account.seed)
        .then((): void => onAction('/'))
        .catch(console.error);
    }
  };

  return (
    <Layout
      actions={[
        <LinkButton key='Cancel' to="/" color="primary">Cancel</LinkButton>,
        <Button key='Create' variant='contained' color='primary' onClick={onCreate}>Create</Button>
      ]}
    >
      <Layout.Content variant="secondary">
        <Loading>{account && (
          <>
            <TextArea
              isReadOnly
              label={`generated 12-word mnemonic seed`}
              value={account.seed}
            />
            <Name isFocussed onChange={setName} />
            {name && <Password onChange={setPassword} />}
            {name && password && (
              <Address address={account.address} name={name} />
            )}
          </>
        )}</Loading>
      </Layout.Content>
    </Layout>
  );
}

export default withOnAction(Create);
