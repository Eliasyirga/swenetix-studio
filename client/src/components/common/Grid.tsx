import styled from '@emotion/styled';
import {
  grid,
  flexbox,
  GridProps as StyledGridProps,
  FlexboxProps,
} from 'styled-system';
import { Box, BoxProps } from './Box';

export interface GridProps extends BoxProps, StyledGridProps, FlexboxProps {
  gap?: string | number;
}

export const Grid = styled(Box)<GridProps>`
  display: grid;
  ${(props) => props.gap && `gap: ${typeof props.gap === 'number' ? `${props.gap}px` : props.gap};`}
  ${grid}
  ${flexbox}
`;
