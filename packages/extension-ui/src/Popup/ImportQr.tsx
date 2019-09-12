// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useContext, useState } from 'react';
import { QrScanAddress } from '@polkadot/react-qr';

import { ActionContext, Address, Button, BackButton, Loading } from '../components';
import { createAccountExternal } from '../messaging';
import { Name } from '../partials';
import Layout from './Layout';

type Props = {};

export default function ImportQr (): React.ReactElement<Props> {
  const onAction = useContext(ActionContext);
  const [account, setAccount] = useState<null | { address: string; genesisHash: string }>(null);
  const [name, setName] = useState<string | null>(null);

  const _onCreate = (): void => {
    if (account && name) {
      createAccountExternal(name, account.address, account.genesisHash)
        .then((): void => onAction('/'))
        .catch((error: Error) => console.error(error));
    }
  };

  return (
    <Layout
      actions={[
        <BackButton key='Cancel'>Cancel</BackButton>,
        <Button key='Create' onClick={_onCreate}>Add account</Button>
      ]}
    >
      <Layout.Content variant="secondary">
        <Loading>
          {!account && <QrScanAddress onScan={setAccount} />}
          {account && (
            <>
              <Name
                autoFocus
                onChange={setName}
              />
              <Address
                {...account}
                name={name}
              />
            </>
          )}
        </Loading>
      </Layout.Content>
    </Layout>
  );
}
