import * as React from 'react';
import styled from 'styled-components';
import cn from 'classnames';

interface IProps {
  className?: string;
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
}

function Content(props: IProps) {
  const { className, variant, children } = props;
  return (
    <div className={cn(className, `variant_${variant}`)}>
      {children}
    </div>
  );
}

export default styled(Content)`
  padding: 16px;

  &.variant_ {
    &primary {
      background: linear-gradient(360deg, #7357D2 0%, #8E41DC 100%);
    }
    &secondary {
      background: #fff;
      flex-grow: 1;
    }
  }
`;
