import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import Button from './Button';
import { ButtonProps } from '@material-ui/core/Button';

type Props = ButtonProps & RouteComponentProps;

function BackButton (props: Props): React.ReactElement<Props> {
  const {
    history, children, variant = 'outlined', color = 'primary',
    ...rest
  } = props;

  delete rest.location;
  delete rest.match;
  delete rest.staticContext;

  return (
    <Button {...rest} variant={variant} color={color} onClick={history.goBack.bind(history)}>
      {children || 'Back'}
    </Button>
  );
}

export default withRouter(BackButton);
