// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringJson } from '@polkadot/ui-keyring/types';
import { Prefix } from '@polkadot/util-crypto/address/types';
import { formatBalance } from '@polkadot/util';

import React, { useState, useEffect, useContext, useMemo } from 'react';
import styled from 'styled-components';
import cn from 'classnames';
import Identicon from '@polkadot/react-identicon';
import Typography from '@material-ui/core/Typography';
import settings from '@polkadot/ui-settings';

import { AccountContext, AssetsContext } from './contexts';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import Box from './Box';

interface Props {
  address: string;
  withBalance?: boolean;
  children?: React.ReactNode;
  className?: string;
  name?: React.ReactNode | null;
  variant?: 'polkadot' | 'substrate';
  boxTheme?: 'light' | 'dark';
  onClick?(): void;
}

function Address({ address, children, className, name, variant = 'polkadot', withBalance = false, onClick, boxTheme }: Props): React.ReactElement<Props> {
  const accounts = useContext(AccountContext);
  const [account, setAccount] = useState<KeyringJson | null>(null);
  const [formatted, setFormatted] = useState<string | null>(null);

  const assets = useContext(AssetsContext);

  const balance = useMemo(() => {
    const foundBalance = assets && assets[address] && assets[address].find(item => item.type === 'balance');
    return foundBalance ? foundBalance.payload : null;
  }, [assets]);

  useEffect((): void => {
    const addrU8a = decodeAddress(address);
    const addrU8aStr = addrU8a.toString();

    setFormatted(
      encodeAddress(addrU8a, (settings.prefix === -1 ? 42 : settings.prefix) as Prefix)
    );
    setAccount(
      accounts.find((account): boolean =>
        decodeAddress(account.address).toString() === addrU8aStr
      ) || null
    );
  }, [address, accounts]);

  return (
    <Box className={className} boxTheme={boxTheme}>
      <Identicon
        className='icon'
        size={64}
        theme={variant}
        value={address}
      />
      <div onClick={onClick} className={cn('address-content', { clickable: !!onClick })}>
        <div className='name'>{name || (account && account.meta.name) || '<unknown>'}</div>
        <div className='address'>{formatted || '<unknown>'}</div>
        {withBalance && (
          <div className='balance'>
            {!balance
              ? 'Loading ...'
              : (<>
                <Typography variant="body1">Total: {formatBalance(balance.free)}</Typography>
                <Typography variant="body1">Available: {formatBalance(balance.available)}</Typography>
              </>)
            }
          </div>
        )}
      </div>
      {!!children && (
        <div className="additional-content">
          {children}
        </div>
      )}
    </Box>
  );
}

export default styled(Address)`
  display: flex;
  flex-wrap: wrap;

  .icon {
    margin-right: 16px;

    & svg circle:first-child {
      fill: white;
    }
  }

  .address-content {
    width: 0;
    flex-grow: 1;
  }

  .additional-content {
    width: 100%;
    padding-top: 0.5rem;
  }

  .address {
    opacity: 0.65;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .balance {
    padding-top: 0.5rem;
  }

  .name {
    padding-bottom: 0.5rem;
  }

  .clickable {
    cursor: pointer;
  }
`;
