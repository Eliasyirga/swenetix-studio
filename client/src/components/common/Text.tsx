import styled from '@emotion/styled';
import {
  space,
  color,
  typography,
  layout,
  SpaceProps,
  ColorProps,
  TypographyProps,
  LayoutProps,
} from 'styled-system';

export interface TextProps extends SpaceProps, ColorProps, TypographyProps, LayoutProps {
  truncate?: boolean;
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
  letterSpacing?: string | number;
  cursor?: string;
}

export const Text = styled.p<TextProps>`
  margin: 0;
  ${(props) =>
    props.truncate &&
    `
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `}
  ${(props) => props.textTransform && `text-transform: ${props.textTransform};`}
  ${(props) => props.letterSpacing && `letter-spacing: ${typeof props.letterSpacing === 'number' ? `${props.letterSpacing}px` : props.letterSpacing};`}
  ${(props) => props.cursor && `cursor: ${props.cursor};`}
  ${space}
  ${color}
  ${typography}
  ${layout}
`;

export interface HeadingProps extends SpaceProps, ColorProps, TypographyProps, LayoutProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  truncate?: boolean;
}

export const Heading = styled.h2<HeadingProps>`
  margin: 0;
  font-family: ${(props) => props.theme.fonts.heading};
  letter-spacing: -0.02em;
  ${(props) =>
    props.truncate &&
    `
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `}
  ${space}
  ${color}
  ${typography}
  ${layout}
`;
