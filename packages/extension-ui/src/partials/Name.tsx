// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useContext, useEffect, useState } from 'react';
import { PropTypes } from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField';

import { TextField, AccountContext } from '../components';

interface Props {
  address?: string;
  autoFocus?: boolean;
  margin?: PropTypes.Margin;
  label?: string | null;
  InputProps?: TextFieldProps['InputProps'];
  classes?: TextFieldProps['classes'];
  onBlur?: () => void;
  onChange: (name: string | null) => void;
}

const MIN_LENGTH = 3;

export default function Name({
  address, autoFocus, onChange, onBlur, InputProps, classes,
  margin = 'normal',
  label = 'a descriptive name for this account',
}: Props): React.ReactElement<Props> {
  const accounts = useContext(AccountContext);
  const [name, setName] = useState('');

  React.useEffect(() => {
    const account = accounts.find((account): boolean => account.address === address);
    const startValue = account && account.name;
    setName(startValue || '');

  }, [accounts, address]);

  const isError = !!name && name.length < MIN_LENGTH;

  useEffect((): void => {
    onChange(isError ? null : name);
  }, [isError, name]);

  const onChangeName = React.useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  }, []);

  return (
    <TextField
      value={name}
      onBlur={onBlur}
      onChange={onChangeName}
      fullWidth
      variant="outlined"
      label={label}
      margin={margin}
      classes={classes}
      error={isError}
      InputProps={{
        autoFocus,
        ...InputProps,
      }}
      InputLabelProps={{
        shrink: true,
      }}
    />
  );
}
