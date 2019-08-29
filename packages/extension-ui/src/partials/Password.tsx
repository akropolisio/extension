// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect, useState } from 'react';

import { TextField } from '../components';

interface Props {
  autoFocus?: boolean;
  onChange: (password: string | null) => void;
}

const MIN_LENGTH = 6;

export default function Password({ autoFocus, onChange }: Props): React.ReactElement<Props> {
  const [pass1, setPass1] = useState('');
  const [pass2, setPass2] = useState('');

  const onChangePass1 = React.useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    setPass1(event.target.value);
  }, []);
  const onChangePass2 = React.useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    setPass2(event.target.value);
  }, []);

  useEffect((): void => {
    onChange(
      (pass1 && pass2 && (pass1.length >= MIN_LENGTH) && (pass1 === pass2))
        ? pass1
        : null
    );
  }, [pass1, pass2]);

  return (
    <>
      <TextField
        type="password"
        value={pass1}
        onChange={onChangePass1}
        fullWidth
        variant="outlined"
        label='a new password for this account'
        margin="normal"
        error={!!pass1 && pass1.length < MIN_LENGTH}
        InputProps={{
          autoFocus,
        }}
        InputLabelProps={{
          shrink: true,
        }}
      />
      {(pass1.length >= MIN_LENGTH) && (
        <TextField
          type="password"
          value={pass2}
          onChange={onChangePass2}
          fullWidth
          variant="outlined"
          label='repeat password for verification'
          margin="normal"
          error={!!pass2 && pass1 !== pass2}
          InputProps={{
            autoFocus,
          }}
          InputLabelProps={{
            shrink: true,
          }}
        />
      )}
    </>
  );
}
