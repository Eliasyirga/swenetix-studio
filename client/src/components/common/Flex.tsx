import styled from '@emotion/styled';
import { flexbox, FlexboxProps } from 'styled-system';
import { Box, BoxProps } from './Box';

export { Box } from './Box';
export type { BoxProps } from './Box';
export { Grid } from './Grid';
export type { GridProps } from './Grid';

export interface FlexProps extends BoxProps, FlexboxProps {
  gap?: string | number;
}

export const Flex = styled(Box)<FlexProps>`
  display: flex;
  ${(props) => props.gap && `gap: ${typeof props.gap === 'number' ? `${props.gap}px` : props.gap};`}
  ${flexbox}
`;

