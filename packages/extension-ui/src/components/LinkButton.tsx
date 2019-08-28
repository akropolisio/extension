import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { PropTypes } from '@material-ui/core';

const AdapterLink = React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => (
  <Link innerRef={ref as any} {...props} />
));

interface IProps {
  to: string;
  color?: PropTypes.Color;
  variant?: 'text' | 'outlined' | 'contained';
  size?: 'small' | 'medium' | 'large';
  children?: React.ReactNode;
  className?: string;
}

export default function LinkButton({ variant = 'contained', color = 'primary', ...rest }: IProps) {
  return (
    <Button component={AdapterLink} variant={variant} color={color} {...rest} />
  );
}
