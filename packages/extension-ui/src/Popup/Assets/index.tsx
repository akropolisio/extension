// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';
import { RouteComponentProps, Switch, Route } from 'react-router';

import { BackButton, Button } from '../../components';
import { routes } from '../../routes';
import BaseLayout from './BaseLayout';
import PreviewPage from './PreviewPage';

interface Props extends RouteComponentProps<{ address: string }> {
  className?: string;
}

function Assets(_props: Props): React.ReactElement<Props> {

  return (
    <Switch>
      <Route exact path={routes.assets.address.getRoutePath()} component={PreviewPage} />
      <Route exact path={routes.assets.address.buy.getRoutePath()}>
        <BaseLayout
          mainActions={[
            <BackButton key="Back" />,
            <Button key="Buy" onClick={console.log}>Buy</Button>,
          ]}
        />
      </Route>
      <Route exact path={routes.assets.address.send.getRoutePath()}>
        <BaseLayout
          mainActions={[
            <BackButton key="Back" />,
            <Button key="Send" onClick={console.log}>Send</Button>,
          ]}
        />
      </Route>
    </Switch>
  );
}

export default styled(Assets)`
  .back-link {
    padding-bottom: 0.5rem;
    display: inline-block;
  }
`;
