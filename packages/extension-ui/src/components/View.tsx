// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';

import defaults from './defaults';

interface Props {
  children: React.ReactNode;
  className?: string;
}

const GlobalStyle = createGlobalStyle`
  #root {
    height: 100%;
  }

  * {
    box-sizing: border-box;
  }
`;

function View({ children, className }: Props): React.ReactElement<Props> {
  return (
    <main className={className}>
      <GlobalStyle />
      {children}
    </main>
  );
}

export default styled(View)`
  color: ${defaults.color};
  font-family: ${defaults.fontFamily};
  font-size: ${defaults.fontSize};
  line-height: ${defaults.lineHeight};
  height: 100%;
  overflow: auto;

  h3 {
    margin: 0 0 0.75rem;
    text-transform: uppercase;
  }
`;
