// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router';
import { Form, Field } from 'react-final-form';
import { FORM_ERROR } from 'final-form';

import { BackButton, Button, Typography } from '../../components';
import { TextField } from '../../components/form';
import { sendBaseAsset } from '../../messaging';
import { routes } from '../../routes';
import BaseLayout from './BaseLayout';
import PreviewPage from './PreviewPage';

interface FormData {
  address: string;
  amount: string;
}

const fields: { [key in keyof FormData]: key } = {
  address: 'address',
  amount: 'amount'
};

interface Props extends RouteComponentProps<{ address: string }> {
  className?: string;
}

function Assets (_props: Props): React.ReactElement<Props> {
  const { address } = _props.match.params;

  const send = React.useCallback(async ({ address: to, amount }: FormData) => {
    try {
      await sendBaseAsset({ from: address, to, amount });
      return;
    } catch (error) {
      return { [FORM_ERROR]: error && error.message };
    }
  }, [address]);

  return (
    <Switch>
      <Route exact path={routes.assets.address.getRoutePath()} component={PreviewPage} />
      <Route exact path={routes.assets.address.buy.getRoutePath()}>
        <BaseLayout
          mainActions={[
            <BackButton key="Back" />,
            <Button key="Buy" disabled>Buy</Button>
          ]}
        />
      </Route>
      <Route exact path={routes.assets.address.send.getRoutePath()}>
        <Form onSubmit={send} subscription={{ submitting: true, submitError: true }}>
          {({ handleSubmit, submitting, submitError }): React.ReactElement<{}> => (
            <form onSubmit={handleSubmit} style={{ height: '100%' }}>
              <BaseLayout
                mainActions={[
                  <BackButton key="Back" />,
                  <Button key="Send" type="submit" disabled={submitting}>Send{submitting && 'ing'}</Button>
                ]}
              >
                <Typography variant="h6" align="center">Send transaction</Typography>
                <Field
                  name={fields.address}
                  component={TextField}
                  fullWidth
                  variant="outlined"
                  label='Address'
                  margin="normal"
                  error={false}
                  InputProps={{
                    autoFocus: true
                  }}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
                <Field
                  name={fields.amount}
                  component={TextField}
                  fullWidth
                  variant="outlined"
                  label='Amount'
                  margin="normal"
                  error={false}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
                {!!submitError && <Typography variant='body1' color="error">{submitError}</Typography>}
              </BaseLayout>
            </form>
          )}
        </Form>
      </Route>
    </Switch>
  );
}

export default Assets;
