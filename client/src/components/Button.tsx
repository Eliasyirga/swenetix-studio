import styled from '@emotion/styled';
import {
  space,
  layout,
  color,
  border,
  typography,
  SpaceProps,
  LayoutProps,
  ColorProps,
  BorderProps,
  TypographyProps,
} from 'styled-system';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends SpaceProps,
    LayoutProps,
    ColorProps,
    BorderProps,
    TypographyProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  variant?: ButtonVariant;
  buttonSize?: ButtonSize;
  isLoading?: boolean;
}

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: ${(props) => props.theme.fonts.heading};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  border-radius: ${(props) => props.theme.radii.md};
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid transparent;
  outline: none;
  position: relative;
  user-select: none;
  white-space: nowrap;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* Size variants */
  ${(props) => {
    switch (props.buttonSize) {
      case 'sm':
        return `
          padding: 6px 12px;
          font-size: 13px;
        `;
      case 'lg':
        return `
          padding: 10px 20px;
          font-size: 15px;
        `;
      default:
        return `
          padding: 8px 16px;
          font-size: 14px;
        `;
    }
  }}

  /* Variant styles */
  ${(props) => {
    switch (props.variant) {
      case 'secondary':
        return `
          background: ${props.theme.colors.surfaceLight};
          color: ${props.theme.colors.text};
          border-color: ${props.theme.colors.surfaceBorder};
          &:hover:not(:disabled) {
            background: ${props.theme.colors.surfaceHover};
            border-color: ${props.theme.colors.textMuted};
          }
        `;
      case 'danger':
        return `
          background: ${props.theme.colors.danger};
          color: #FFFFFF;
          &:hover:not(:disabled) {
            background: ${props.theme.colors.dangerHover};
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: ${props.theme.colors.text};
          border-color: ${props.theme.colors.surfaceBorder};
          &:hover:not(:disabled) {
            background: ${props.theme.colors.surfaceLight};
            border-color: ${props.theme.colors.primary};
            color: ${props.theme.colors.primary};
          }
        `;
      case 'ghost':
        return `
          background: transparent;
          color: ${props.theme.colors.textSecondary};
          &:hover:not(:disabled) {
            background: ${props.theme.colors.surfaceLight};
            color: ${props.theme.colors.text};
          }
        `;
      case 'primary':
      default:
        return `
          background: ${props.theme.colors.primary};
          color: #FFFFFF;
          &:hover:not(:disabled) {
            background: ${props.theme.colors.primaryHover};
          }
        `;
    }
  }}

  ${space}
  ${layout}
  ${color}
  ${border}
  ${typography}
`;
