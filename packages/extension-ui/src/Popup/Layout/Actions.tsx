import * as React from 'react';
import { makeStyles } from '@material-ui/styles';

import { Grid } from '../../components';

interface Props {
  children?: React.ReactNode;
}

const useStyles = makeStyles({
  root: {
    padding: 16
  }
});

function Actions (props: Props): React.ReactElement<Props> | null {
  const children = React.Children.toArray(props.children).filter(Boolean);
  const cns = useStyles();

  return children.length ? (
    <div className={cns.root}>
      <Grid container spacing={1} justify="center">
        {children.map((child, index) => (
          <Grid key={index} item xs={6}>
            <Grid container direction="column">
              {child}
            </Grid>
          </Grid>
        ))}
      </Grid>
    </div>
  ) : null;
}

export { Props as ActionsProps };
export default Actions;
