import * as React from 'react';
import styled from 'styled-components';
import settings from '@polkadot/ui-settings';

import Content, { ContentProps } from './Content';
import { Link, Typography, Grid } from '../../components';
import { SettingsIcon } from '../../components/icons';
import { routes } from '../../routes';

interface IProps {
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode[];
}

function Layout(props: IProps) {
  const { className, actions, children } = props;

  const activeNode = settings.availableNodes.find(node => node.value.toString() === settings.apiUrl);

  return (
    <div className={className}>
      <Grid container spacing={2} wrap="nowrap" className="header">
        <Grid item zeroMinWidth>
          <Typography noWrap>
            {activeNode
              ? activeNode.text
              : 'Custom node'
            }
          </Typography>
        </Grid>
        <Grid item xs>
          <Link to={routes.settings.getRedirectPath()}>
            <SettingsIcon color="primary" className="settings-icon" />
          </Link>
        </Grid>
      </Grid>
      <div className="content">
        {children}
      </div>
      {!!actions && (
        <div className="actions">
          <Grid container spacing={1} justify="center">
            {actions.map((action, index) => (
              <Grid item xs={6} key={index}>
                <Grid container direction="column">
                  {action}
                </Grid>
              </Grid>
            ))}
          </Grid>
        </div>
      )}
    </div>
  );
}

const Component = styled(Layout)`
  min-height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .header {
    min-height: 48px;
    padding: 8px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .actions {
    padding: 16px;
  }

  .settings-icon {
    display: block;
  }
`;

type ComponentType = typeof Component & {
  Content: typeof Content;
};

(Component as ComponentType).Content = Content;

export { ContentProps };
export default Component as ComponentType;
