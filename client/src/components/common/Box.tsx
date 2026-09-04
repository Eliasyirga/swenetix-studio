import styled from '@emotion/styled';
import {
  space,
  color,
  layout,
  border,
  position,
  shadow,
  flexbox,
  typography,
  SpaceProps,
  ColorProps,
  LayoutProps,
  BorderProps,
  PositionProps,
  ShadowProps,
  FlexboxProps,
  TypographyProps,
} from 'styled-system';

export interface BoxProps
  extends SpaceProps,
    ColorProps,
    LayoutProps,
    BorderProps,
    PositionProps,
    ShadowProps,
    FlexboxProps,
    TypographyProps {
  cursor?: string;
  transition?: string;
  backdropFilter?: string;
  gap?: string | number;
}

export const Box = styled.div<BoxProps>`
  box-sizing: border-box;
  ${(props) => props.cursor && `cursor: ${props.cursor};`}
  ${(props) => props.transition && `transition: ${props.transition};`}
  ${(props) => props.backdropFilter && `backdrop-filter: ${props.backdropFilter};`}
  ${(props) => props.gap && `gap: ${typeof props.gap === 'number' ? `${props.gap}px` : props.gap};`}
  ${space}
  ${color}
  ${layout}
  ${flexbox}
  ${typography}
  ${border}
  ${position}
  ${shadow}
`;
