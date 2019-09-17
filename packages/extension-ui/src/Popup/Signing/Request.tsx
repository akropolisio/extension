// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ExtrinsicPayload } from '@polkadot/types/interfaces';
import { AccountJson, RequestExtrinsicSign } from '@polkadot/extension/background/types';

import React, { useContext, useState, useEffect, useCallback, ChangeEvent } from 'react';
import { createType } from '@polkadot/types';

import { ActionContext, Address, Button, Typography, TextField } from '../../components';
import { approveSignPassword, approveSignSignature, cancelSignRequest } from '../../messaging';
import Details from './Details';
import Qr from './Qr';
import Layout from '../Layout';

interface Props {
  account: AccountJson;
  isFirst: boolean;
  request: RequestExtrinsicSign;
  signId: string;
  url: string;
}

export default function Request ({ account: { isExternal }, isFirst, request, signId, url }: Props): React.ReactElement<Props> | null {
  const onAction = useContext(ActionContext);
  const [payload, setPayload] = useState<ExtrinsicPayload | null>(null);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');

  const _handlePasswordChanging = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    error && setError('');
  }, []);

  useEffect((): void => {
    setPayload(createType('ExtrinsicPayload', request, { version: request.version }));
  }, [request]);

  if (!payload) {
    return null;
  }

  const isVisibleSign = isFirst && !isExternal;

  const _onCancel = (): Promise<void> =>
    cancelSignRequest(signId)
      .then((): void => onAction())
      .catch((error: Error) => console.error(error));
  const _onSign = (): Promise<void> =>
    approveSignPassword(signId, password)
      .then((): void => onAction())
      .catch((error: Error) => setError(error.message || String(error)));
  const _onSignature = ({ signature }: { signature: string }): Promise<void> =>
    approveSignSignature(signId, signature)
      .then((): void => onAction())
      .catch((error: Error) => console.error(error));

  return (
    <Layout
      headerContent={<Typography variant="h4">Transactions</Typography>}
      isHiddenHeader={!isFirst}
    >
      <Layout.Content variant="primary">
        <Address withBalance address={request.address} boxTheme="dark" />
      </Layout.Content>
      <Layout.Content variant="secondary">
        {isExternal && isFirst
          ? <Qr
            payload={payload}
            request={request}
            onSignature={_onSignature}
          />
          : <Details
            isDecoded={isFirst}
            payload={payload}
            request={request}
            url={url}
          />
        }
        {isVisibleSign && (
          <TextField
            autoFocus
            fullWidth
            variant="outlined"
            error={!password || !!error}
            helperText={error}
            label='password for this account'
            onChange={_handlePasswordChanging}
            type='password'
            margin="normal"
          />
        )}
      </Layout.Content>
      <Layout.Actions>
        <Button variant="outlined" onClick={_onCancel}>Cancel</Button>
        {isVisibleSign && <Button color="primary" onClick={_onSign}>Sign</Button>}
      </Layout.Actions>
    </Layout>
  );
}
