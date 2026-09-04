import styled from '@emotion/styled';
import {
  space,
  layout,
  border,
  typography,
  SpaceProps,
  BorderProps,
  TypographyProps,
} from 'styled-system';

export interface InputProps
  extends SpaceProps,
    BorderProps,
    TypographyProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'color' | 'width' | 'height'> {
  hasError?: boolean;
  width?: string | number;
}

export const Input = styled.input<InputProps>`
  width: 100%;
  padding: 8px 12px;
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  font-family: ${(props) => props.theme.fonts.body};
  font-size: 14px;
  border-radius: ${(props) => props.theme.radii.md};
  border: 1px solid
    ${(props) =>
      props.hasError ? props.theme.colors.danger : props.theme.colors.surfaceBorder};
  outline: none;
  transition: all 0.15s ease;
  box-sizing: border-box;

  &::placeholder {
    color: ${(props) => props.theme.colors.textMuted};
  }

  &:focus {
    border-color: ${(props) =>
      props.hasError ? props.theme.colors.danger : props.theme.colors.primary};
    box-shadow: 0 0 0 2px
      ${(props) =>
        props.hasError
          ? props.theme.colors.dangerLight
          : props.theme.colors.primaryLight};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${space}
  ${layout}
  ${border}
  ${typography}
`;
