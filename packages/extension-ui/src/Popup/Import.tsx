// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { OnActionFromCtx } from '../components/types';

import React, { useState } from 'react';

import { Address, Button, TextArea, withOnAction } from '../components';
import { createAccount, validateSeed } from '../messaging';
import { Name, Password } from '../partials';
import Layout from './Layout';

interface Props {
  onAction: OnActionFromCtx;
}

function Import({ onAction }: Props): React.ReactElement<Props> {
  const [account, setAccount] = useState<null | { address: string; seed: string }>(null);
  const [name, setName] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  const onChangeSeed = (seed: string): Promise<void> =>
    validateSeed(seed)
      .then(setAccount)
      .catch((): void => setAccount(null));

  // FIXME Duplicated between here and Create.tsx
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
        <Button key='Cancel' label='Cancel' to="/" variant="text" />,
        <Button key='Import' label='Import' onClick={onCreate} />
      ]}
    >
      <Layout.Content variant="secondary">
        <TextArea
          isError={!account}
          isFocussed
          label={`existing 12 or 24-word mnemonic seed`}
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
