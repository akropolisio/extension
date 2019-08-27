import * as React from 'react';
import styled from 'styled-components';
import Content from './Content';
import { Link } from '../../components';
import { SettingsIcon } from '../../components/icons';

interface IProps {
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode[];
}

function Layout(props: IProps) {
  const { className, actions, children } = props;
  return (
    <div className={className}>
      <div className="header">
        <span>Selector</span>
        <Link to="/settings">
          <SettingsIcon color="primary" className="settings-icon" />
        </Link>
      </div>
      <div className="content">
        {children}
      </div>
      {!!actions && (
        <div className="actions">
          {actions.map((action, index) => (
            <div className="action" key={index}>
              {action}
            </div>
          ))}
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
    padding: 24px;
    margin: -10px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }

  .action {
    padding: 10px;
  }

  .settings-icon {
    display: block;
  }
`;

type ComponentType = typeof Component & {
  Content: typeof Content;
};

(Component as ComponentType).Content = Content;

export default Component as ComponentType;
