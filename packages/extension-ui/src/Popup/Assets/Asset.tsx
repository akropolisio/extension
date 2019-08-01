// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IAsset } from '@polkadot/extension/background/types';

import React from 'react';
import styled from 'styled-components';

import { Box, Button } from '../../components';

interface Props {
  asset: IAsset;
  className?: string;
}

function Asset({ asset, className }: Props): React.ReactElement<Props> {

  return (
    <Box className={className}>
      <div className='content'>
        <div className='amount'>{asset.payload.balance}</div>
        <div className='symbol'>{asset.payload.symbol}</div>
        <div className='actions'>
          <Button className='action' isDisabled>Send</Button>
        </div>
      </div>
    </Box>
  );
}

export default styled(Asset)`
  .content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .amount {
    padding-right: 0.75rem;
    margin-right: auto;
  }
  .symbol {
    margin-right: 0.75rem;
    text-transform: uppercase;
  }
  .action {
    margin-right: 0.75rem;

    &:last-child {
      margin-right: 0;
    }
  }
`;
