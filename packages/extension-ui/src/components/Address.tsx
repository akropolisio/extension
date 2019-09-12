// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountJson } from '@polkadot/extension/background/types';
import { Chain } from '@polkadot/extension-chains/types';
import { Prefix } from '@polkadot/util-crypto/address/types';
import { formatBalance } from '@polkadot/util';

import React, { useState, useEffect, useContext, useMemo } from 'react';
import styled from 'styled-components';
import cn from 'classnames';
import findChain from '@polkadot/extension-chains';
import Identicon from '@polkadot/react-identicon';
import Typography from '@material-ui/core/Typography';
import settings from '@polkadot/ui-settings';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';

import { AccountContext, AssetsContext } from './contexts';
import Box from './Box';

interface Props {
  address: string;
  withBalance?: boolean;
  children?: React.ReactNode;
  className?: string;
  name?: React.ReactNode | null;
  genesisHash?: string | null;
  variant?: 'polkadot' | 'substrate';
  boxTheme?: 'light' | 'dark';
  onClick?(): void;
}

// find an account in our list
function findAccount(accounts: AccountJson[], publicKey: Uint8Array): AccountJson | null {
  const pkStr = publicKey.toString();

  return accounts.find(({ address }): boolean =>
    decodeAddress(address).toString() === pkStr
  ) || null;
}

// recodes an supplied address using the prefix/genesisHash, include the actual saved account & chain
function recodeAddress(address: string, accounts: AccountJson[], genesisHash?: string | null): [string, AccountJson | null, Chain] {
  // decode and create a shortcut for the encoded address
  const publicKey = decodeAddress(address);

  // find our account using the actual publicKey, and then find the associated chain
  const account = findAccount(accounts, publicKey);
  const chain = findChain((account && account.genesisHash) || genesisHash);

  return [
    // always allow the actual settings to override the display
    encodeAddress(publicKey, (settings.prefix === -1 ? chain.ss58Format : settings.prefix) as Prefix),
    account,
    chain
  ];
}

function Address({ address, children, className, genesisHash, name, variant = 'polkadot', withBalance = false, onClick, boxTheme }: Props): React.ReactElement<Props> {
  const accounts = useContext(AccountContext);
  const [account, setAccount] = useState<AccountJson | null>(null);
  const [chain, setChain] = useState<Chain | null>(null);
  const [formatted, setFormatted] = useState<string | null>(null);

  const assets = useContext(AssetsContext);

  const balance = useMemo(() => {
    const foundBalance = assets && assets[address] && assets[address].find(item => item.type === 'balance');
    return foundBalance ? foundBalance.payload : null;
  }, [assets]);

  useEffect((): void => {
    const [formatted, account, chain] = recodeAddress(address, accounts, genesisHash);

    setFormatted(formatted);
    setChain(chain);
    setAccount(account);
  }, [address, accounts]);

  return (
    <Box
      banner={chain && chain.genesisHash && chain.name}
      className={className}
      boxTheme={boxTheme}
    >
      <Identicon
        className='icon'
        size={64}
        theme={variant}
        value={address}
      />
      <div onClick={onClick} className={cn('address-content', { clickable: !!onClick })}>
        <div className='name'>{name || (account && account.name) || '<unknown>'}</div>
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
