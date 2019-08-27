// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router';

import { Address, Link, unicode } from '../../components';
import Layout from '../Layout';

interface Props extends RouteComponentProps<{ address: string }> {
  className?: string;
}

function Assets(props: Props): React.ReactElement<Props> {
  const { match } = props;
  const { address } = match.params;

  return (
    <Layout actions={['Action 1', 'Action 2']}>
      <Layout.Content variant="primary">
        <Address withBalance address={address} />
      </Layout.Content>
      <Layout.Content variant="secondary">
        <Link to='/' className='back-link'>{unicode.BACK} Back</Link>
      </Layout.Content>
    </Layout>
  );
}

export default styled(Assets)`
  .back-link {
    padding-bottom: 0.5rem;
    display: inline-block;
  }
`;
