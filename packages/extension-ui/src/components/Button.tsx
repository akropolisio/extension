// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

import defaults from './defaults';

interface Props {
  className?: string;
  children?: React.ReactNode;
  variant?: 'contained' | 'text';
  isDanger?: boolean;
  isDisabled?: boolean;
  isSmall?: boolean;
  label?: string;
  onClick?: () => void | Promise<void>;
  to?: string;
}

const DISABLED_OPACITY = '0.3';

function Button({ children, className, isDisabled, label, onClick, to, variant = 'contained' }: Props): React.ReactElement<Props> {
  const _onClick = (): void => {
    if (isDisabled) {
      return;
    }

    onClick && onClick();

    if (to) {
      window.location.hash = to;
    }
  };

  return (
    <div className={className}>
      <button onClick={_onClick} className={`variant_${variant}`}>
        {label}{children}
      </button>
    </div>
  );
}

export default styled(Button)`
  box-sizing: border-box;
  display: ${({ isSmall }): string => isSmall ? 'inline-block' : 'block'};
  width: ${({ isSmall }): string => isSmall ? 'auto' : '100%'};

  button {
    border: ${defaults.btnBorder}${({ isDanger }): string => isDanger ? defaults.btnColorDanger : defaults.btnColorVariantContained};
    border-radius: ${defaults.borderRadius};
    cursor: pointer;
    display: block;
    font-size: ${defaults.fontSize};
    opacity: ${({ isDisabled }): string => isDisabled ? DISABLED_OPACITY : '1.0'};
    padding: ${defaults.btnPadding};
    text-align: center;
    width: 100%;

    &:hover {
      opacity: ${({ isDisabled }): string => isDisabled ? DISABLED_OPACITY : '0.8'};
    }

    &.variant_contained {
      background: ${({ isDanger }): string => isDanger ? defaults.btnBgDanger : defaults.btnBg};
      color: ${({ isDanger }): string => isDanger ? defaults.btnColorDanger : defaults.btnColorVariantContained};
      box-shadow: ${defaults.btnShadow};
    }

    &.variant_text {
      background: transparent;
      color: ${defaults.btnColorVariantText};
    }
  }
`;
