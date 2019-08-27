// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import cn from 'classnames';
import MuiButton, { ButtonProps } from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';

import defaults from './defaults';

const useStyles = makeStyles({
  root: {
    '&$isDanger': {
      '&$contained': {
        background: defaults.btnBgDanger,
        color: defaults.btnColorDanger,
      },
    },
  },
  isDanger: {},
  contained: {},
});

type Props = Omit<ButtonProps, 'classes'> & {
  isDanger?: boolean;
}

function Button({ isDanger, ...rest }: Props): React.ReactElement<Props> {
  const classes = useStyles();

  return (
    <MuiButton
      {...rest}
      classes={{
        root: cn(classes.root, { [classes.isDanger]: isDanger }),
        contained: classes.contained,
      }}
    />
  );
}

export { Props as ButtonProps };
export default Button;
