// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

import Label from './Label';
import defaults from './defaults';

interface Props {
  className?: string;
  defaultValue?: string | null;
  isError?: boolean;
  isFocussed?: boolean;
  isReadOnly?: boolean;
  label?: string | null;
  onBlur?: () => void;
  onChange?: (value: string) => void;
  type?: 'text' | 'password';
  value?: string;
}

function Input ({ className, defaultValue, label, isFocussed, isReadOnly, onBlur, onChange, type = 'text', value }: Props): React.ReactElement<Props> {
  const _onChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>): void => {
    onChange && onChange(value.trim());
  };

  return (
    <Label
      className={className}
      label={label}
    >
      <input
        autoFocus={isFocussed}
        defaultValue={defaultValue || undefined}
        readOnly={isReadOnly}
        onBlur={onBlur}
        onChange={_onChange}
        type={type}
        value={value}
      />
    </Label>
  );
}

export default styled(Input)`
  input {
    background: ${({ isError, isReadOnly }): string => isError ? defaults.box.error.background : (isReadOnly ? '#eee' : '#fff')};
    border-color: ${({ isError }): string => isError ? defaults.box.error.border : defaults.inputBorder};
    border-radius: ${defaults.borderRadius};
    border-style: solid;
    border-width: 1px;
    box-sizing: border-box;
    color: ${({ isError }): string => isError ? defaults.box.error.border : defaults.color};
    display: block;
    font-family: ${defaults.fontFamily};
    font-size: ${defaults.fontSize};
    padding: ${({ label }): string => label ? defaults.inputPaddingLabel : defaults.inputPadding};
    width: 100%;

    &:read-only {
      box-shadow: none;
      outline: none;
    }
  }
`;
