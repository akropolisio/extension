import * as React from 'react';
import styled from 'styled-components';
import cn from 'classnames';
import Box from '@material-ui/core/Box';

import { ComingSoon } from '../../components';

type PaddingProps = Partial<Record<'px' | 'py' | 'pt' | 'pr' | 'pb' | 'pl', number>>;

interface Props extends PaddingProps {
  className?: string;
  variant: 'primary' | 'secondary';
  children?: React.ReactNode;
}

function Content (props: Props): React.ReactElement<Props> {
  const { className, variant, children, ...rest } = props;
  return (
    <Box p={2} {...rest} className={cn(className, `variant_${variant}`)}>
      {children || <ComingSoon />}
    </Box>
  );
}

export { Props as ContentProps };
export default styled(Content)`
  position: relative;

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
