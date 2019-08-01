// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { RouteComponentProps } from 'react-router';

import { Header, Link, Tip, unicode, Address } from '../../components';
import Asset from './Asset';
import { IAsset } from '@polkadot/extension/background/types';

interface Props extends RouteComponentProps<{ address: string }> { }

const mockAssets: IAsset[] = [
  {
    type: 'balance',
    payload: {
      balance: '2000000000',
      symbol: 'DOT',
    },
  },
  {
    type: 'balance',
    payload: {
      balance: '1000000000',
      symbol: 'DOTs',
    },
  },
  {
    type: 'balance',
    payload: {
      balance: '4500000000',
      symbol: 'DOTrr',
    },
  },
]

function Assets(props: Props): React.ReactElement<Props> {
  const { match } = props;
  const { address } = match.params;

  return (
    <div>
      <Header
        label='assets'
        labelExtra={<Link to='/'>{unicode.BACK} Back</Link>}
      />
      <Address address={address} />
      {
        (mockAssets.length === 0)
          ? <Tip header='assets not found' type='info'>You currently don&apos;t have any assets.</Tip>
          : mockAssets.map((asset, index): React.ReactNode => (
            <Asset
              asset={asset}
              key={index}
            />
          ))
      }
    </div>
  );
}

export default Assets;
