// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import TextField from '@material-ui/core/TextField';


interface DrodownOption {
  text: string;
  value: string;
}

interface Props {
  label?: string | null;
  onChange?: (value: string) => void;
  options: DrodownOption[];
  value?: string;
}

function Dropdown({ label, onChange, options, value }: Props): React.ReactElement<Props> {
  const _onChange = ({ target: { value } }: React.ChangeEvent<HTMLSelectElement>): void => {
    onChange && onChange(value);
  };

  return (
    <TextField
      select
      fullWidth
      label={label}
      value={value}
      onChange={_onChange}
      SelectProps={{
        native: true,
      }}
      margin="normal"
      variant="outlined"
    >
      {options.map(({ text, value }): React.ReactNode => (
        <option
          key={value}
          value={value}
        >
          {text}
        </option>
      ))}
    </TextField>
  );
}

export default Dropdown;
