// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Prefix } from '@polkadot/util-crypto/address/types';

import React, { useState } from 'react';
import settings from '@polkadot/ui-settings';
import { setAddressPrefix } from '@polkadot/util-crypto';

import { Dropdown, Input, Button } from '../../components';
import { notifyApiUrlChanged } from '../../messaging';
import Layout from '../Layout';

const prefixOptions = settings.availablePrefixes.map(({ text, value }): { text: string; value: string } => ({
  text: value === -1
    ? 'Substrate (default)'
    : text,
  value: `${value}`
}));

const apiUrlOptions = [{ text: 'Custom node', value: '' }].concat(
  settings.availableNodes.map(({ text, value }) => ({ text, value: `${value}` })),
)

function isCustomNode(value: string) {
  return !settings.availableNodes.some(item => item.value === value);
}

const INITIAL_CUSTOM_URL = 'wss://';

export default function Settings(): React.ReactElement<{}> {
  const [prefix, setPrefix] = useState(`${settings.prefix}`);
  const [currentApiUrl, setCurrentApiUrl] = useState(settings.apiUrl);
  const [selectedApiUrl, selectApiUrl] = useState(isCustomNode(settings.apiUrl) ? '' : `${settings.apiUrl}`);
  const [customApiUrl, setCustomApiUrl] = useState(isCustomNode(settings.apiUrl) ? `${settings.apiUrl}` : INITIAL_CUSTOM_URL);

  // FIXME check against index, we need a better solution
  const _onChangePrefix = (value: string): void => {
    const prefix = parseInt(value, 10) as Prefix;

    setPrefix(value);
    setAddressPrefix((prefix as number) === -1 ? 42 : prefix);

    settings.set({ prefix });
  };

  const _saveApiUrl = (value: string) => {
    settings.set({ apiUrl: value });
    setCurrentApiUrl(value);
    notifyApiUrlChanged(value);
  }

  const _onChangeUrl = (value: string): void => {
    selectApiUrl(value);
    if (value) {
      _saveApiUrl(value);
    }
  };

  const _onChangeCustomUrl = (value: string): void => {
    setCustomApiUrl(value);
  };

  const _onApplyCustomUrl = (): void => {
    _saveApiUrl(customApiUrl);
  };

  return (
    <Layout
      actions={[<Button key='Cancel' label='Cancel' to="/" />]}
    >
      <Layout.Content variant="secondary">
        <Dropdown
          label='display addresses formatted for'
          onChange={_onChangePrefix}
          options={prefixOptions}
          value={`${prefix}`}
        />
        <Dropdown
          label='remote node/endpoint to connect to'
          onChange={_onChangeUrl}
          options={apiUrlOptions}
          value={selectedApiUrl}
        />
        {!selectedApiUrl && (<>
          <Input
            label='custom endpoint URL'
            value={customApiUrl}
            onChange={_onChangeCustomUrl}
          />
          {!!customApiUrl && customApiUrl !== INITIAL_CUSTOM_URL && customApiUrl !== currentApiUrl && (
            <Button onClick={_onApplyCustomUrl}>Apply Custom URL</Button>
          )}
        </>)}
      </Layout.Content>
    </Layout>
  );
}
