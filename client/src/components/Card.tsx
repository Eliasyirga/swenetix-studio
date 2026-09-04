import styled from '@emotion/styled';
import {
  space,
  color,
  layout,
  border,
  SpaceProps,
  ColorProps,
  LayoutProps,
  BorderProps,
} from 'styled-system';

export interface CardProps
  extends SpaceProps,
    ColorProps,
    LayoutProps,
    BorderProps {
  interactive?: boolean;
}

export const Card = styled.div<CardProps>`
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.surfaceBorder};
  border-radius: ${(props) => props.theme.radii.lg};
  padding: 20px;
  position: relative;
  transition: all 0.15s ease;

  ${(props) =>
    props.interactive &&
    `
    cursor: pointer;
    &:hover {
      background: ${props.theme.colors.surfaceHover};
      border-color: ${props.theme.colors.textMuted};
    }
  `}

  ${space}
  ${color}
  ${layout}
  ${border}
`;
