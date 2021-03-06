// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

import defaults from './defaults';

interface Color {
  background: string;
  border: string;
  color: string;
}

type Type = keyof typeof defaults.box;

interface Props {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  type?: Type;
}

function getColor ({ type }: Props): Color {
  return defaults.box[type || 'info'] || defaults.box.info;
}

function Tip ({ children, className, header }: Props): React.ReactElement<Props> {
  return (
    <article className={className}>
      {header && <h3>{header}</h3>}
      <div>{children}</div>
    </article>
  );
}

// box-shadow: ${defaults.boxShadow};
export default styled(Tip)`
  background: ${(p): string => getColor(p).background};
  border-left: 0.25rem solid ${(p): string => getColor(p).border};
  color: ${(p): string => getColor(p).color};
  margin: 0.75rem -1rem;
  padding: 1rem 1.5rem;

  h3 {
    color: ${(p): string => getColor(p).border};
    font-weight: normal;
  }
`;
