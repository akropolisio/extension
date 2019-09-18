import * as React from 'react';
import cn from 'classnames';
import { Typography } from '@material-ui/core';

import { Logo } from '../icons';
import { useStyles } from './GlobalLoader.style';

interface Props {
  description?: string;
  position?: 'absolute' | 'fixed';
}

function GlobalLoader (props: Props): React.ReactElement<Props> {
  const { description, position = 'fixed' } = props;
  const classes = useStyles();
  return (
    <div className={cn(classes.root, classes[position])}>
      <div className={classes.content}>
        <Logo className={classes.logo} />
        <div className={classes.spinner} >
          <div className={classes.circle} />
          <div className={classes.circle} />
          <div className={classes.circle} />
        </div>
        {description && <Typography>{description}</Typography>}
      </div>
    </div>
  );
}

export default GlobalLoader;
