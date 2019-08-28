import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import Button from './Button';
import { ButtonProps } from '@material-ui/core/Button';

function BackButton(props: ButtonProps & RouteComponentProps) {
  const { history, children, variant = 'outlined', color = 'primary', ...rest } = props;
  return (
    <Button {...rest} variant={variant} color={color} onClick={history.goBack}>
      {children || 'Back'}
    </Button>
  );
}

export default withRouter(BackButton);
