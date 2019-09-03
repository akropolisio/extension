// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useContext, useState, useEffect } from 'react';

import { Address, Button, Loading, ActionContext, BackButton, TextField } from '../components';
import { createAccount, createSeed, validateSeed } from '../messaging';
import { Name, Password } from '../partials';
import Layout from './Layout';

interface Props {
  type: 'createNew' | 'import';
}

export default function Create({ type }: Props): React.ReactElement<Props> {
  const onAction = useContext(ActionContext);
  const [seed, setSeed] = useState<string>('');
  const [account, setAccount] = useState<null | { address: string; suri: string }>(null);
  const [name, setName] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  useEffect((): void => {
    type === 'createNew' && createSeed()
      .then(account => {
        setAccount(account);
        setSeed(account.suri);
      })
      .catch((error: Error) => console.error(error));
  }, []);

  const onChangeSeed = React.useCallback((event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    setSeed(event.currentTarget.value);
    return validateSeed(event.currentTarget.value)
      .then(setAccount)
      .catch((): void => setAccount(null))
  }, []);

  const onCreate = (): void => {
    if (name && password && account) {
      createAccount(name, password, account.suri)
        .then((): void => onAction('/'))
        .catch((error: Error) => console.error(error));
    }
  };

  return (
    <Layout
      actions={[
        <BackButton key='Cancel'>Cancel</BackButton>,
        <Button key='Create' onClick={onCreate}>{type === 'createNew' ? 'Create' : 'Import'}</Button>
      ]}
    >
      <Layout.Content variant="secondary">
        <Loading>
          {(account || type === 'import') && (
            <TextField
              value={seed}
              onChange={onChangeSeed}
              fullWidth
              multiline
              rowsMax="3"
              variant="outlined"
              label='generated 12-word mnemonic seed'
              margin="normal"
              error={type === 'import' && !!seed && !account}
              InputProps={{
                readOnly: type === 'createNew',
                autoFocus: type === 'import',
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
          {account && <Name autoFocus={type === 'createNew'} onChange={setName} />}
          {account && name && <Password onChange={setPassword} />}
          {account && name && password && (
            <Address address={account.address} name={name} />
          )}
        </Loading>
      </Layout.Content>
    </Layout>
  );
}
