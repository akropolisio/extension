// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router';

import { BackButton } from '../../components';
import BaseLayout from './BaseLayout';

interface Props extends RouteComponentProps<{ address: string }> {
  className?: string;
}

function Assets(props: Props): React.ReactElement<Props> {
  const { match } = props;
  const { address } = match.params;

  return (
    <BaseLayout
      mainActions={[<BackButton className='back-link' />]}
    >
      Content
    </BaseLayout>
  );
}

export default styled(Assets)`
  .back-link {
    padding-bottom: 0.5rem;
    display: inline-block;
  }
`;
