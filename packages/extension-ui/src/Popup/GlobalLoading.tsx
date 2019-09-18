// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import { GlobalLoader } from '../components';
import Layout from './Layout';

function GlobalLoading (): React.ReactElement {
  return (
    <Layout>
      <Layout.Content variant="secondary">
        <GlobalLoader position="absolute" />
      </Layout.Content>
    </Layout>
  );
}

export default GlobalLoading;
