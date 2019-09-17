// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RequestAuthorizeTab } from '@polkadot/extension/background/types';

import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/styles';

import { ActionContext, Button, Tip, defaults, Typography } from '../../components';
import { approveAuthRequest, rejectAuthRequest } from '../../messaging';
import Layout from '../Layout';

interface Props {
  authId: string;
  isFirst: boolean;
  request: RequestAuthorizeTab;
  url: string;
}

const useStyles = makeStyles({
  tabInfo: {
    overflow: 'hidden'
  },

  tabHighlightedInfo: {
    color: defaults.linkColor,
    display: 'inline-block',
    verticalAlign: 'top',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
});

function Request ({ authId, isFirst, request: { origin }, url }: Props): React.ReactElement<Props> {
  const onAction = useContext(ActionContext);
  const cns = useStyles();
  const _onApprove = (): Promise<void> =>
    approveAuthRequest(authId)
      .then((): void => onAction())
      .catch((error: Error) => console.error(error));
  const _onReject = (): Promise<void> =>
    rejectAuthRequest(authId)
      .then((): void => onAction())
      .catch((error: Error) => console.error(error));

  return (
    <Layout
      headerContent={<Typography variant="h4">Authorize</Typography>}
      isHiddenHeader={!isFirst}
    >
      <Layout.Content variant="secondary">
        <Typography variant="body1" gutterBottom className={cns.tabInfo}>
          {'An application, self-identifying as '}
          <span className={cns.tabHighlightedInfo}>{origin}</span>
          {' is requesting access from '}
          <span className={cns.tabHighlightedInfo}>{url}</span>.
        </Typography>
        <Tip header='access' type='warn'>Only approve this request if you trust the application. Approving gives the application access to the addresses of your accounts.</Tip>
      </Layout.Content>
      <Layout.Actions>
        <Button variant="outlined" onClick={_onReject}>Reject</Button>
        <Button onClick={_onApprove}>Allow access</Button>
      </Layout.Actions>
    </Layout>
  );
}

export default Request;
