// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { OnActionFromCtx } from '../components/types';

import React, { useState } from 'react';

import { Address, Button, TextArea, withOnAction, LinkButton } from '../components';
import { createAccount, validateSeed } from '../messaging';
import { Name, Password } from '../partials';
import Layout from './Layout';

interface Props {
  onAction: OnActionFromCtx;
}

function Import({ onAction }: Props): React.ReactElement<Props> {
  const [account, setAccount] = useState<null | { address: string; suri: string }>(null);
  const [name, setName] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  const onChangeSeed = (suri: string): Promise<void> =>
    validateSeed(suri)
      .then(setAccount)
      .catch((): void => setAccount(null));

  // FIXME Duplicated between here and Create.tsx
  const onCreate = (): void => {
    // this should always be the case
    if (name && password && account) {
      createAccount(name, password, account.suri)
        .then((): void => onAction('/'))
        .catch(console.error);
    }
  };

  return (
    <Layout
      actions={[
        <LinkButton key='Cancel' to="/" color="primary">Cancel</LinkButton>,
        <Button key='Import' variant='contained' color='primary' onClick={onCreate}>Import</Button>
      ]}
    >
      <Layout.Content variant="secondary">
        <TextArea
          isError={!account}
          isFocussed
          label='existing 12 or 24-word mnemonic seed'
          onChange={onChangeSeed}
        />
        {account && <Name onChange={setName} />}
        {account && name && <Password onChange={setPassword} />}
        {account && name && password && (
          <Address address={account.address} name={name} />
        )}
      </Layout.Content>
    </Layout>
  );
}

export default withOnAction(Import);
