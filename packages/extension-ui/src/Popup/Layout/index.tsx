import * as React from 'react';
import settings from '@polkadot/ui-settings';
import { makeStyles } from '@material-ui/core';

import Content, { ContentProps } from './Content';
import Actions, { ActionsProps } from './Actions';
import { Link, Typography, Grid } from '../../components';
import { SettingsIcon } from '../../components/icons';
import { routes } from '../../routes';
import { availableNodes } from '../../constants';

interface Props {
  children: React.ReactNode;
  headerContent?: React.ReactNode;
  isHiddenHeader?: boolean;
}

const useStyles = makeStyles({
  root: {
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },

  header: {
    minHeight: 48,
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  content: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column'
  },

  settingsIcon: {
    display: 'block'
  }
});

function Layout (props: Props): React.ReactElement<Props> {
  const { headerContent, isHiddenHeader } = props;
  const children = React.Children.toArray(props.children);
  const filteredChildren = children.filter(value => React.isValidElement(value) && value.type !== Actions);
  const actionChildren = children.filter(value => React.isValidElement(value) && value.type === Actions);
  const cns = useStyles();

  const activeNode = availableNodes.find(node => node.value.toString() === settings.apiUrl);

  return (
    <div className={cns.root}>
      {!isHiddenHeader && (
        <Grid container spacing={2} wrap="nowrap" className={cns.header}>
          {headerContent ? (
            <Grid item zeroMinWidth>
              {headerContent}
            </Grid>
          ) : (
              <>
                <Grid item zeroMinWidth>
                  <Typography noWrap>
                    {activeNode
                      ? activeNode.text
                      : 'Custom node'
                    }
                  </Typography>
                </Grid>
                <Grid item>
                  <Link to={routes.settings.getRedirectPath()}>
                    <SettingsIcon color="primary" className={cns.settingsIcon} />
                  </Link>
                </Grid>
              </>
          )}
        </Grid>
      )}
      <div className={cns.content}>
        {filteredChildren}
      </div>
      {actionChildren}
    </div>
  );
}

type ComponentType = typeof Layout & {
  Content: typeof Content;
  Actions: typeof Actions;
};

(Layout as ComponentType).Content = Content;
(Layout as ComponentType).Actions = Actions;

export { ContentProps, ActionsProps };
export default Layout as ComponentType;
