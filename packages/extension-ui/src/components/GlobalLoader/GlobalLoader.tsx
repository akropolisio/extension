import * as React from 'react';
import { Typography } from '@material-ui/core';

import { Logo } from '../icons';
import { provideStyles, StylesProps } from './GlobalLoader.style';

type Props = StylesProps & {
  description?: string;
}

function GlobalLoader (props: Props): React.ReactElement<Props> {
  const { classes, description } = props;
  return (
    <div className={classes.root}>
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

export default provideStyles(GlobalLoader);
