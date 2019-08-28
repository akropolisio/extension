import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import SwipeableViews from 'react-swipeable-views';

import { LinkButton, BackButton, Tabs, Tab } from '../../components';
import { routes } from '../../routes';
import BaseLayout from './BaseLayout';
import Layout from '../Layout';

type IProps = RouteComponentProps<{ address: string }>

function PreviewPage(props: IProps) {
  const { address } = props.match.params;
  const [activeTab, setActiveTab] = React.useState(0);

  const handleChange = React.useCallback((_event: React.ChangeEvent<{}>, newValue: number) => {
    setActiveTab(newValue);
  }, []);

  return (
    <BaseLayout
      addressActions={[
        <LinkButton
          color="secondary"
          variant="outlined"
          to={routes.assets.address.buy.getRedirectPath({ address })}
        >
          Buy
        </LinkButton>,
        <LinkButton
          color="secondary"
          variant="outlined"
          to={routes.assets.address.send.getRedirectPath({ address })}
        >
          Send
        </LinkButton>,
      ]}
      mainActions={[<BackButton key="Back" />]}
      contentProps={{ pt: 0 }}
    >
      <Tabs
        value={activeTab}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        aria-label="full width tabs example"
      >
        <Tab label="Transactions" />
        <Tab label="Analytics" />
      </Tabs>
      <SwipeableViews index={activeTab} onChangeIndex={setActiveTab} >
        <Layout.Content px={0} variant="secondary" />
        <Layout.Content px={0} variant="secondary" />
      </SwipeableViews>
    </BaseLayout>
  );
}

export default PreviewPage;
