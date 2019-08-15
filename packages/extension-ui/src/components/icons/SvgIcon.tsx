import React from 'react';
import cn from 'classnames';
import styled from 'styled-components';

import defaults from '../defaults';

interface IProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Node passed into the SVG element.
   */
  children: React.ReactNode;
  /**
   * @ignore
   */
  className?: string;
  /**
   * The color of the component. It supports those theme colors that make sense for this component.
   * You can use the `htmlColor` prop to apply a color attribute to the SVG element.
   */
  color?: 'inherit' | 'primary' | 'secondary' | 'action' | 'error' | 'disabled',
  /**
   * The component used for the root node.
   * Either a string to use a DOM element or a component.
   */
  component?: React.ElementType,
  /**
   * The fontSize applied to the icon. Defaults to 24px, but can be configure to inherit font size.
   */
  fontSize?: 'inherit' | 'default' | 'small' | 'large',
  /**
   * Applies a color attribute to the SVG element.
   */
  htmlColor?: string,
  /**
   * The shape-rendering attribute. The behavior of the different options is described on the
   * [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/shape-rendering).
   * If you are having issues with blurry icons you should investigate this property.
   */
  shapeRendering?: string,
  /**
   * Provides a human-readable title for the element that contains it.
   * https://www.w3.org/TR/SVG-access/#Equivalent
   */
  titleAccess?: string,
  /**
   * Allows you to redefine what the coordinates without units mean inside an SVG element.
   * For example, if the SVG element is 500 (width) by 200 (height),
   * and you pass viewBox="0 0 50 20",
   * this means that the coordinates inside the SVG will go from the top left corner (0,0)
   * to bottom right (50,20) and each unit will be worth 10px.
   */
  viewBox?: string,
}

const SvgIcon = React.forwardRef(function SvgIcon(props: IProps, ref: React.Ref<any>) {
  const {
    children,
    className,
    color = 'inherit',
    component: Component = 'svg',
    fontSize = 'default',
    htmlColor,
    titleAccess,
    viewBox = '0 0 24 24',
    ...other
  } = props;

  return (
    <Component
      className={cn(
        className,
        {
          [`color_${color}`]: color !== 'inherit',
          [`fontSize_${fontSize}`]: fontSize !== 'default',
        },
      )}
      focusable="false"
      viewBox={viewBox}
      color={htmlColor}
      aria-hidden={titleAccess ? 'false' : 'true'}
      role={titleAccess ? 'img' : 'presentation'}
      ref={ref}
      {...other}
    >
      {children}
      {titleAccess ? <title>{titleAccess}</title> : null}
    </Component>
  );
});

export { IProps as SvgIconProps };
export default styled(SvgIcon)`
  user-select: none;
  width: 1em;
  height: 1em;
  display: inline-block;
  fill: currentColor;
  flex-shrink: 0;
  font-size: 1.5rem;
  transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

  &.color_ {
    &primary {
      color: ${defaults.palette.primary.main};
    }
    &secondary {
      color: ${defaults.palette.secondary.main};
    }
    &action {
      color: ${defaults.palette.action.active};
    }
    &error {
      color: ${defaults.palette.error.main};
    }
    &disabled {
      color: ${defaults.palette.action.disabled};
    }
  }

  &.fontSize_ {
    &inherit {
      font-size: inherit;
    }
    &small {
      font-size: 1.25rem;
    }
    &large {
      font-size: 2rem;
    }
  }
`;
