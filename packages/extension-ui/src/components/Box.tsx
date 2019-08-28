// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';
import cn from 'classnames';

import defaults from './defaults';

interface Props {
  children: React.ReactNode;
  boxTheme?: 'light' | 'dark';
  className?: string;
}

function Box({ children, className, boxTheme = 'light' }: Props): React.ReactElement<Props> {
  return (
    <article className={cn(className, { [`box-theme_${boxTheme}`]: true })}>
      {children}
    </article>
  );
}

export default styled(Box)`
  border: ${defaults.boxBorder};
  border-radius: ${defaults.borderRadius};
  box-shadow: ${defaults.boxShadow};
  font-family: ${defaults.fontFamily};
  font-size: ${defaults.fontSize};
  padding: 0.75rem 1rem;

  &.box-theme_ {
    &light {
      background: ${defaults.boxBg};
      color: ${defaults.color};
    }
    &dark {
      background: transparent;
      color: white;
    }
  }
`;
