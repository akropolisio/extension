// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router';
import { IAsset } from '@polkadot/extension/background/types';

import { Header, Link, Tip, unicode, Address, Button } from '../../components';
import { loadAssets } from '../../messaging';
import Layout from '../Layout';
import Asset from './Asset';

interface Props extends RouteComponentProps<{ address: string }> {
  className?: string;
}

function Assets(props: Props): React.ReactElement<Props> {
  const { match, className } = props;
  const { address } = match.params;
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [assets, setAssets] = React.useState<IAsset[]>([]);

  const _loadAssets = React.useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const assets = await loadAssets(address);
      setAssets(assets);
    } catch (error) {
      setError(String(error));
      setAssets([]);
    }
    setLoading(false);
  }, [address]);

  React.useEffect(() => { _loadAssets() }, []);

  return (
    <Layout actions={['Action 1', 'Action 2']}>
      <Layout.Content variant="primary">
        <Address address={address} />
      </Layout.Content>
      <Layout.Content variant="secondary">
        {!loading && (<>
          {!!error && <Tip header='something went wrong' type='error'>{error}</Tip>}
          {!error && assets.length === 0
            ? <Tip header='assets not found' type='info'>You currently don&apos;t have any assets.</Tip>
            : assets.map((asset, index): React.ReactNode => (
              <Asset
                asset={asset}
                key={index}
              />
            ))
          }
        </>)}
      </Layout.Content>
      {/* <div className={className}>
        <Header
          label='assets'
          labelExtra={(
            <Button onClick={_loadAssets} isDisabled={loading} className='reload'>
              {!loading ? 'Reload' : '... Loading ...'}
            </Button>
          )}
        />
        <Link to='/' className='back-link'>{unicode.BACK} Back</Link>
      </div> */}
    </Layout>
  );
}

export default styled(Assets)`
  .back-link {
    padding-bottom: 0.5rem;
    display: inline-block;
  }
  .reload {
    margin: 0;

    & button {
      padding: 0.375rem 1rem;
    }
  }
`;
