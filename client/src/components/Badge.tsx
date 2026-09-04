import styled from '@emotion/styled';
import {
  space,
  color,
  layout,
  border,
  typography,
  SpaceProps,
  ColorProps,
  LayoutProps,
  BorderProps,
  TypographyProps,
} from 'styled-system';
import { AppTheme } from '../theme/theme';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'neutral';

export interface BadgeProps
  extends SpaceProps,
    ColorProps,
    LayoutProps,
    BorderProps,
    TypographyProps {
  variant?: BadgeVariant;
  isActive?: boolean;
  clickable?: boolean;
}

const getBadgeStyles = (theme: AppTheme, variant: BadgeVariant = 'neutral') => {
  switch (variant) {
    case 'primary':
      return {
        bg: theme.colors.primaryLight,
        color: theme.colors.primary,
        border: theme.colors.primaryBorder,
      };
    case 'secondary':
      return {
        bg: theme.colors.secondaryLight,
        color: theme.colors.secondary,
        border: theme.colors.secondaryBorder,
      };
    case 'success':
      return {
        bg: theme.colors.successLight,
        color: theme.colors.success,
        border: theme.colors.successBorder,
      };
    case 'warning':
      return {
        bg: theme.colors.warningLight,
        color: theme.colors.warning,
        border: theme.colors.warningBorder,
      };
    case 'danger':
      return {
        bg: theme.colors.dangerLight,
        color: theme.colors.danger,
        border: theme.colors.dangerBorder,
      };
    case 'neutral':
    default:
      return {
        bg: theme.colors.surfaceLight,
        color: theme.colors.textMuted,
        border: theme.colors.surfaceBorder,
      };
  }
};

export const Badge = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  border-radius: ${(props) => props.theme.radii.sm};
  font-size: 12px;
  font-weight: ${(props) => props.theme.fontWeights.medium};
  letter-spacing: 0.01em;
  transition: all 0.15s ease;
  user-select: none;

  ${(props) => {
    const s = getBadgeStyles(props.theme as AppTheme, props.variant);
    if (props.isActive) {
      return `
        background-color: ${props.theme.colors.primary};
        color: #FFFFFF;
        border: 1px solid ${props.theme.colors.primary};
      `;
    }
    return `
      background-color: ${s.bg};
      color: ${s.color};
      border: 1px solid ${s.border};
    `;
  }}

  ${(props) =>
    props.clickable &&
    `
    cursor: pointer;
    &:hover {
      background-color: ${props.theme.colors.primaryLight};
      color: ${props.theme.colors.primary};
      border-color: ${props.theme.colors.primaryBorder};
    }
  `}

  ${space}
  ${color}
  ${layout}
  ${border}
  ${typography}
`;
