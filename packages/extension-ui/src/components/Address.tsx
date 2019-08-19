// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringJson } from '@polkadot/ui-keyring/types';
import { Prefix } from '@polkadot/util-crypto/address/types';
import { AccountsFromCtx } from './types';

import React, { useState, useEffect, useContext, useMemo } from 'react';
import styled from 'styled-components';
import Identicon from '@polkadot/react-identicon';
import settings from '@polkadot/ui-settings';

import IconBox from './IconBox';
import { withAccounts, AssetsContext } from './contexts';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';

interface Props {
  accounts: AccountsFromCtx;
  address: string;
  withBalance?: boolean;
  children?: React.ReactNode;
  className?: string;
  name?: React.ReactNode | null;
  theme?: 'polkadot' | 'substrate';
  onClick?(): void;
}

function Address({ accounts, address, children, className, name, theme = 'polkadot', withBalance = false, onClick }: Props): React.ReactElement<Props> {
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
  }, [address]);

  return (
    <IconBox
      className={className}
      icon={
        <Identicon
          className='icon'
          size={64}
          theme={theme}
          value={address}
        />
      }
      intro={
        <div onClick={onClick} className={onClick ? 'clickable' : undefined}>
          <div className='name'>{name || (account && account.meta.name) || '<unknown>'}</div>
          <div className='address'>{formatted || '<unknown>'}</div>
          {withBalance && (
            <div className='balance'>
              {balance
                ? `${balance.free} ${balance.symbol}`
                : 'Loading ...'
              }
            </div>
          )}
        </div>
      }
    >
      {children}
    </IconBox>
  );
}

export default withAccounts(styled(Address)`
  .address {
    opacity: 0.5;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .name {
    padding-bottom: 0.5rem;
  }

  .clickable {
    cursor: pointer;
  }
`);
